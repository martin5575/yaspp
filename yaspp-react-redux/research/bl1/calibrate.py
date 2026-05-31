#!/usr/bin/env python3
"""
Calibrate BL1 team parameters from the previous completed season.

Method
------
All 18 BL1 teams play each other twice (home + away) over 34 rounds.
Because every team faces the same pool of opponents across the season,
simple per-team goal averages are a good enough strength estimate without
additional opponent-strength correction.

Attack  = avg goals scored per game / league_avg
Defense = avg goals conceded per game / league_avg
(both then normalised so geometric mean = 1.0)

Home advantage is calibrated directly from the data:
  homeAdv = sqrt(avg_home_goals / avg_away_goals)
  (from the Poisson model identities lambda_h ∝ homeAdv * leagueAvg,
   lambda_a ∝ leagueAvg / homeAdv)

Promoted teams
--------------
The 2–3 teams promoted from BL2 have no BL1 data. We use the mean
of the relegated teams' ratings as their starting estimate (promoted
and relegated teams swap roughly equal places in the standings).

Usage
-----
python3 calibrate.py <target_year> <source_year>
  e.g.  python3 calibrate.py 2026 2025     (run from repo root or here)
        python3 calibrate.py 2025 2024

The script writes to public/data/bl1-<target_year>-params.json
"""

import sys, json, math, os
import urllib.request

# ─── Args ─────────────────────────────────────────────────────────────────────

TARGET = int(sys.argv[1]) if len(sys.argv) > 1 else 2026
SOURCE = int(sys.argv[2]) if len(sys.argv) > 2 else TARGET - 1

LEAGUE = 'bl1'
API    = 'https://api.openligadb.de'

# ─── Helpers ──────────────────────────────────────────────────────────────────

def fetch(url):
    with urllib.request.urlopen(url, timeout=20) as r:
        return json.loads(r.read())

def full_time(match):
    """Return (home_goals, away_goals) or None if no final result."""
    for r in match.get('matchResults', []):
        if r.get('resultTypeID') == 2:
            return r['pointsTeam1'], r['pointsTeam2']
    return None

def geo_mean(vals):
    return math.exp(sum(math.log(max(v, 1e-9)) for v in vals) / len(vals))

# ─── Fetch data ───────────────────────────────────────────────────────────────

print(f"Fetching BL1 {SOURCE} match data …")
all_matches = fetch(f'{API}/getmatchdata/{LEAGUE}/{SOURCE}')
played = [m for m in all_matches if m['matchIsFinished'] and full_time(m)]
print(f"  {len(played)} completed matches")

print(f"Fetching team lists …")
source_teams = {t['teamId']: t for t in fetch(f'{API}/getavailableteams/{LEAGUE}/{SOURCE}')}

target_teams = {}
try:
    raw = fetch(f'{API}/getavailableteams/{LEAGUE}/{TARGET}')
    if raw:
        target_teams = {t['teamId']: t for t in raw}
        print(f"  {len(target_teams)} teams in BL1 {TARGET}")
    else:
        print(f"  BL1 {TARGET} team list not available yet — will use {SOURCE} teams + template")
except Exception as e:
    print(f"  BL1 {TARGET} not available ({e}) — will use {SOURCE} teams + template")

# ─── Compute per-team stats ───────────────────────────────────────────────────

stats = {}   # teamId → { scored, conceded, h_scored, h_conceded, games, h_games }
for m in played:
    t1 = m['team1']['teamId']
    t2 = m['team2']['teamId']
    hg, ag = full_time(m)

    for tid in (t1, t2):
        if tid not in stats:
            stats[tid] = dict(scored=0, conceded=0, h_scored=0, h_conceded=0,
                               games=0, h_games=0)

    stats[t1]['scored']   += hg; stats[t1]['conceded'] += ag; stats[t1]['games'] += 1
    stats[t2]['scored']   += ag; stats[t2]['conceded'] += hg; stats[t2]['games'] += 1
    stats[t1]['h_scored'] += hg; stats[t1]['h_conceded'] += ag; stats[t1]['h_games'] += 1

# ─── League averages ─────────────────────────────────────────────────────────

total_goals  = sum(s['scored'] for s in stats.values())
total_tg     = sum(s['games']  for s in stats.values()) // 2  # each match counted twice
league_avg   = total_goals / (2 * total_tg) if total_tg else 1.4

# Home advantage: homeAdv = sqrt(avg_home / avg_away)
total_home_g = sum(s['h_scored']  for s in stats.values())
total_away_g = sum(s['scored'] - s['h_scored'] for s in stats.values())
home_adv     = math.sqrt(total_home_g / total_away_g) if total_away_g else 1.15

print(f"  League avg : {league_avg:.3f} goals/team/game")
print(f"  Home adv   : {home_adv:.4f}  ({total_home_g} home goals, {total_away_g} away goals)")

# ─── Attack / defense ratings ─────────────────────────────────────────────────

raw_params = {}
for tid, s in stats.items():
    if s['games'] == 0:
        continue
    raw_params[tid] = {
        'attack':  (s['scored']   / s['games']) / league_avg,
        'defense': (s['conceded'] / s['games']) / league_avg,
        'n':       s['games'],
    }

# Normalise: geometric mean = 1.0
gm_atk = geo_mean([p['attack']  for p in raw_params.values()])
gm_def = geo_mean([p['defense'] for p in raw_params.values()])
for tid in raw_params:
    raw_params[tid]['attack']  = round(raw_params[tid]['attack']  / gm_atk, 4)
    raw_params[tid]['defense'] = round(raw_params[tid]['defense'] / gm_def, 4)

# ─── Promoted-team template ───────────────────────────────────────────────────

relegated_ids = set(source_teams) - set(target_teams) if target_teams else set()
promoted_ids  = set(target_teams) - set(source_teams) if target_teams else set()

if not relegated_ids:
    # No 2026 team list yet — use the bottom-3 of 2025 as the template
    ranked = sorted(raw_params.items(),
                    key=lambda x: x[1]['attack'] - x[1]['defense'])  # worst overall
    relegated_ids = {tid for tid, _ in ranked[:3]}
    print(f"  No {TARGET} team list — using bottom-3 of {SOURCE} as promoted-team template")

relegated_atk = sum(raw_params[t]['attack']  for t in relegated_ids if t in raw_params) / max(len(relegated_ids), 1)
relegated_def = sum(raw_params[t]['defense'] for t in relegated_ids if t in raw_params) / max(len(relegated_ids), 1)
promoted_template = {'attack': round(relegated_atk, 4), 'defense': round(relegated_def, 4)}

print(f"  Relegated ({SOURCE}→{TARGET}): "
      f"{[source_teams[t]['teamName'] for t in relegated_ids if t in source_teams]}")
if promoted_ids:
    print(f"  Promoted  (→{TARGET}): "
          f"{[target_teams[t]['teamName'] for t in promoted_ids]}")

# Assign template to promoted teams that have no source-season data
for tid in promoted_ids:
    if tid not in raw_params:
        raw_params[tid] = {**promoted_template, 'n': 0}

# ─── Build output ─────────────────────────────────────────────────────────────

all_known = {**source_teams, **target_teams}

teams_out = {}
for tid, p in sorted(raw_params.items(), key=lambda x: -x[1]['attack']):
    t = all_known.get(tid, {})
    src = 'relegated_avg' if tid in promoted_ids else 'season_data'
    teams_out[str(tid)] = {
        'name':    t.get('teamName', str(tid)),
        'attack':  p['attack'],
        'defense': p['defense'],
        'n':       p['n'],
        'source':  src,
    }

output = {
    'league':              LEAGUE,
    'targetYear':          TARGET,
    'sourceYear':          SOURCE,
    'leagueAvg':           round(league_avg, 4),
    'homeAdvantage':       round(home_adv,   4),
    'promotedTeamTemplate': promoted_template,
    'teams':               teams_out,
}

# ─── Write ────────────────────────────────────────────────────────────────────

HERE    = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.dirname(os.path.dirname(HERE))   # …/yaspp-react-redux
out_path = os.path.join(PROJECT, 'public', 'data', f'bl1-{TARGET}-params.json')
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w') as f:
    json.dump(output, f, indent=2)

# ─── Summary ─────────────────────────────────────────────────────────────────

print()
print(f"Written → {out_path}")
print()
print(f"{'ID':<6} {'Team':<30} {'ATK':>6} {'DEF':>6} {'N':>4}  Source")
print("-" * 62)
for tid_s, p in teams_out.items():
    print(f"{tid_s:<6} {p['name']:<30} {p['attack']:>6.3f} {p['defense']:>6.3f} {p['n']:>4}  {p['source']}")
