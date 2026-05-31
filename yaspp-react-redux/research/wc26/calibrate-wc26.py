#!/usr/bin/env python3
"""
Calibrate WC26 team parameters from:
  - wc26-stats.json   : recent match history per team (35 of 48 teams)
  - wc26-teams.json   : FIFA rankings + squad values for all 48 WC teams

Method
------
1. For each team with match data, compute *opponent-adjusted* attack and defense:
     adj_for_m     = goals_for_m     * clamp(opp_strength / median, 0.5, 2.0)
     adj_against_m = goals_against_m / clamp(opp_strength / median, 0.5, 2.0)
   Weighted by exponential recency decay (newest match = weight 1.0).

2. For the 13 teams without match data, estimate via FIFA points:
     attack  = (fifaPoints / median) ^ K_POWER
     defense = (fifaPoints / median) ^ -K_POWER

3. Blend: teams with more match data rely less on the FIFA prior.
     final = w_match * match_param + (1 - w_match) * fifa_param
     where w_match = min(1, n_matches / FULL_DATA_N)

4. Normalize: divide all attacks by their geometric mean (and same for defense),
   so the "average WC team" has attack=defense=1.0.

Output: public/data/wc26-params.json
"""

import json, math, statistics, os

# ─── Constants ────────────────────────────────────────────────────────────────

LEAGUE_AVG        = 1.35   # goals per team per WC game (~2.7 total/game historically)
DECAY             = 0.88   # recency decay per match step (newest = weight 1.0)
OPP_MIN, OPP_MAX  = 0.65, 1.45  # opponent-strength ratio clamp
NON_WC_FACTOR     = 0.68   # non-WC opponents ≈ 68% of median strength
K_POWER           = 1.6    # FIFA-points exponent for attack/defense estimates
FULL_DATA_N       = 15     # matches for full match-data trust
MAX_ATK_BLEND     = 0.75   # max weight for match-data on attack
MAX_DEF_BLEND     = 0.45   # max weight for match-data on defense (noisier)
WINSOR_MULT       = 2.8    # cap per-game adjusted values at WINSOR_MULT × leagueAvg

# OpenLigaDB shortName → canonical code used in wc26-teams.json
OPENLIGA_ALIAS = {
    'PAR': 'PRY',   # Paraguay
    'PRT': 'POR',   # Portugal
    'SCT': 'SCO',   # Scotland
    'RSA': 'ZAF',   # South Africa
}

# Direct OpenLigaDB teamId → canonical code (primary lookup, avoids shortName issues)
TEAM_ID_MAP = {
    4766: 'EGY', 7322: 'DZA', 764: 'ARG', 750: 'AUS', 2673: 'BEL',
    2671: 'BIH', 753: 'BRA', 7321: 'CUW', 139: 'DEU', 4991: 'COD',
    2670: 'ECU', 4993: 'CIV', 755: 'ENG', 1647: 'FRA', 754: 'GHA',
    5820: 'HTI', 7434: 'IRQ', 5570: 'IRN', 749: 'JPN', 7323: 'JOR',
    1645: 'CAN', 6159: 'CPV', 4912: 'QAT', 1469: 'COL', 7325: 'HRV',
    4629: 'MAR', 761: 'MEX', 846: 'NZL', 4353: 'NLD', 1396: 'NOR',
    37: 'AUT', 4631: 'PAN', 756: 'PRY', 3198: 'POR', 4670: 'SAU',
    5271: 'SCO', 151: 'SWE', 38: 'CHE', 4630: 'SEN', 170: 'ESP',
    677: 'ZAF', 751: 'KOR', 141: 'CZE', 1391: 'TUN', 153: 'TUR',
    5593: 'URY', 762: 'USA', 7324: 'UZB',
}

# ─── Load ─────────────────────────────────────────────────────────────────────

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(os.path.dirname(HERE))  # project root (yaspp-react-redux)
DATA = HERE                                     # data files live alongside this script

with open(os.path.join(DATA, 'wc26-teams.json')) as f:
    wc_teams = json.load(f)['teams']

with open(os.path.join(DATA, 'wc26-stats.json')) as f:
    team_stats = json.load(f)['teamStats']

# ─── Lookups ──────────────────────────────────────────────────────────────────

fifa_pts    = {t['code']: t['fifaPoints']  for t in wc_teams}
fifa_rank   = {t['code']: t['fifaRank']    for t in wc_teams}
squad_val   = {t['code']: t['squadValueM'] for t in wc_teams}
name_by_code = {t['code']: t['name']       for t in wc_teams}

median_strength = statistics.median(fifa_pts.values())
non_wc_strength = median_strength * NON_WC_FACTOR

def opp_ratio(opp_code):
    pts = fifa_pts.get(opp_code, non_wc_strength)
    return max(OPP_MIN, min(OPP_MAX, pts / median_strength))

# ─── Step 1: match-data estimates ────────────────────────────────────────────

match_params = {}

for ts in team_stats:
    code    = ts['team']
    matches = ts['matches']          # sorted newest → oldest
    if not matches:
        continue

    w_adj_for = w_adj_against = w_sum = 0.0

    cap = WINSOR_MULT * LEAGUE_AVG           # per-game Winsorization ceiling
    for i, m in enumerate(matches):
        w = DECAY ** i
        s = opp_ratio(m['opponent'])

        raw_for     = min(m['goalsFor']     * s,        cap)
        raw_against = min(m['goalsAgainst'] / s,        cap)

        w_adj_for     += raw_for     * w
        w_adj_against += raw_against * w
        w_sum         += w

    avg_for     = w_adj_for     / w_sum
    avg_against = w_adj_against / w_sum

    match_params[code] = {
        'attack':    avg_for     / LEAGUE_AVG,
        'defense':   avg_against / LEAGUE_AVG,
        'n_matches': len(matches),
    }

# ─── Step 2: FIFA-based estimates for all 48 teams ───────────────────────────

fifa_params = {}
for code, pts in fifa_pts.items():
    norm = pts / median_strength
    # power law: norm^K_POWER so median team = 1.0 exactly
    fifa_params[code] = {
        'attack':  norm **  K_POWER,
        'defense': norm ** -K_POWER,
    }

# ─── Step 3: blend match data with FIFA prior ────────────────────────────────

blended = {}
for code in fifa_pts:
    n     = match_params.get(code, {}).get('n_matches', 0)
    w_atk = min(MAX_ATK_BLEND, n / FULL_DATA_N)
    w_def = min(MAX_DEF_BLEND, n / FULL_DATA_N)

    mp  = match_params.get(code, {'attack': 1.0, 'defense': 1.0})
    fp  = fifa_params[code]

    blended[code] = {
        'attack':    w_atk * mp['attack']  + (1 - w_atk) * fp['attack'],
        'defense':   w_def * mp['defense'] + (1 - w_def) * fp['defense'],
        'n_matches': n,
        'source':    'blended' if n > 0 else 'fifa_only',
    }

# ─── Step 4: normalize → geometric mean = 1.0 ───────────────────────────────

def geo_mean(vals):
    return math.exp(sum(math.log(max(v, 1e-9)) for v in vals) / len(vals))

gm_atk = geo_mean([b['attack']  for b in blended.values()])
gm_def = geo_mean([b['defense'] for b in blended.values()])

for code in blended:
    blended[code]['attack']  = round(blended[code]['attack']  / gm_atk, 4)
    blended[code]['defense'] = round(blended[code]['defense'] / gm_def, 4)

# ─── Output ───────────────────────────────────────────────────────────────────

sorted_teams = sorted(blended.items(), key=lambda x: -x[1]['attack'])

output = {
    'leagueAvg':          LEAGUE_AVG,
    'medianFifaPoints':   round(median_strength, 0),
    'generatedAt':        '2026-05-31',
    'codeMap':            OPENLIGA_ALIAS,
    'teamIdMap':          {str(k): v for k, v in TEAM_ID_MAP.items()},
    'teams': {
        code: {
            'name':    name_by_code.get(code, code),
            'attack':  p['attack'],
            'defense': p['defense'],
            'source':  p['source'],
            'n':       p['n_matches'],
        }
        for code, p in sorted_teams
    }
}

out_path = os.path.join(BASE, 'public', 'data', 'wc26-params.json')
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w') as f:
    json.dump(output, f, indent=2)

# ─── Summary ─────────────────────────────────────────────────────────────────

print(f"Median FIFA: {median_strength:.0f}  |  gm_atk={gm_atk:.3f}  gm_def={gm_def:.3f}")
print(f"Output: {out_path}")
print()
print(f"{'Code':<5} {'Name':<25} {'ATK':>6} {'DEF':>6} {'N':>4}  Source")
print("-" * 60)
for code, p in sorted_teams:
    src  = '(FIFA)' if p['source'] == 'fifa_only' else f"n={p['n_matches']}"
    name = name_by_code.get(code, code)
    print(f"{code:<5} {name:<25} {p['attack']:>6.3f} {p['defense']:>6.3f} {p['n_matches']:>4}  {src}")
