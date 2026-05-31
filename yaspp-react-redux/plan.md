# YASPP Feature Plan

## Status legend
- ✅ Done  
- 🔄 In progress  
- ⬜ Pending

---

## 1. Team Form Chart (Letzte 5 Spiele) ✅

Replaced D3 SVG chart with a pure HTML/CSS flexbox layout.

**Problem fixed:** Fixed-width SVG (350 px) overflowed inside the ~160 px half-column on iPhone. Text was drawn outside the SVG viewport (form summary at y = −10, opponent labels at y = 100 = edge).

**Files:**
- `src/parts/TeamFormChart.jsx` — removed D3 entirely; renders 5 flex columns (venue · circle · score · opponent)
- `src/parts/TeamFormChart.css` — responsive flex layout, shrinks on ≤ 400 px

---

## 2. Navigation — remove stale leagues ✅

**Problem:** 3.Bundesliga and WM18 persisted in the menu after being commented out of `leagues.js`, because the full Redux model (including `leagues`) is saved to `localStorage` and `fetchInitial` only loaded fresh leagues when the store was empty.

**Fix:** `src/actions/ActionBuilder.js` — always call `fetchLeagues()` on init (unconditional), so `localStorage`-cached leagues are overwritten on every page load.

---

## 3. Season Simulator — League mode ✅

A new **Saison-Simulation** panel (chart-bar icon, top-right navbar).

### Model
- **Attack / Defense** ratings per team, normalised to league average: `attack = goals_scored / avg`, `defense = goals_conceded / avg`
- **Moving average** for params: `α × recent_N_games + (1−α) × long-term` (α and N configurable)
- **Poisson model**: `λ_home = attack_home × defense_away × homeAdvantage × leagueAvg`
- **Streak dynamics**: after every simulated match within a path, each team's attack and defense are updated via EMA at rate γ — hot/cold streaks propagate forward through the rest of the season
- **10 000 paths** default, runs in a Web Worker (no UI freeze)
- Progress bar updates every 200 paths

### Results
- Final standings table sorted by average predicted points
- Columns: Ø Punkte · Range · P(1st) · P(Top4) · P(Relegation)
- Color-coded cells (green = good, red = danger)

### UX
- Parameter inputs collapse automatically when results appear; clickable "Parameter ▸" header to re-expand
- Header shows active league + year (e.g. "— BL1 2025")
- Results auto-reset when league/year selection changes

### Files
- `src/simulation/params.js` — `computeTeamParams`, `getRemainingMatches`, `getCurrentPoints`, `getSeasonTeamIds`, `isTournamentLeague`, `detectHostNations`
- `src/simulation/simulationWorker.js` — Web Worker, Poisson RNG, EMA param update
- `src/parts/SimulationView.jsx`
- `src/parts/SimulationView.css`
- `src/components/MainNavbar.jsx` — adds SimulationView trigger
- `src/Root.jsx` — registers `faChartBar` icon

---

## 4. Season Simulator — Home/Away for WC vs League ✅

**Problem:** In a league, the listed home team genuinely plays at home. In a World Cup, all matches are on neutral ground — except the 3 host nations (USA, Canada, Mexico for WM26).

**Model:**
- **League**: `adv = homeAdvantage` for home team, `1/homeAdvantage` for away
- **Tournament**: `adv = hostAdvantage` if host nation is in home slot; `1/hostAdvantage` if in away slot; `1.0` for all other matches
- Auto-detect host nations by team name patterns (`detectHostNations` in `params.js`)
- UI switches between "Heimvorteil" (league) and "Gastgebervorteil + Gastgeber-list" (tournament)

**Detected host nations for WM26:** USA, Kanada, Mexiko (matched against `team.name`/`team.shortName`)

---

## 5. Season Simulator — WC Tournament mode 🔄

### Why different from league
The WM26 OpenLigaDB data contains all 8 rounds (3 group + R32 + R16 + QF + SF + Final). Simulating knockouts with a points model is wrong: draws must resolve via extra time / penalties, and bracket matchups depend on simulated group results (R32 fixtures are not yet seeded in the API).

### Tournament format (WM26)
- 12 groups × 4 teams = 48 teams
- Group stage: 3 rounds, standard points (W=3, D=1, L=0)
- Advance: top 2 per group (24) + best 8 thirds = **32 teams** to R32
- Knockout: R32 → R16 → QF → SF → Final (5 rounds)

### Algorithm per simulation path
1. **Group stage**: Poisson match simulation → group standings (pts → GD → GF → random tiebreak)
2. **Best-8 thirds**: sort all 12 third-place teams by pts/GD/GF, keep top 8
3. **Seeding 32 teams**: group winners ranked by performance (seeds 1–12), then runners-up (13–24), then best thirds (25–32)
4. **Bracket**: `team[i] vs team[31−i]` standard protection bracket — top seed plays bottom seed, 1 & 2 can only meet in the Final
5. **Knockout match**: 90 min Poisson (neutral, `adv = 1.0`); draw → extra time (`λ/3` for 30 min); still draw → 50/50 penalties
6. **Param EMA**: applied after every match (group + knockout) within the path

### Results display
- **Group stage**: one card per group (A–L), teams sorted by avg position, columns: P(1st) · P(2nd) · P(3rd adv.) · P(exit)
- **Knockout table**: all teams sorted by P(champion), columns: Group exit · R32 · R16 · QF · SF · Final · Win
- **Additional probs** (per user request): P(top 8) and P(top 16) derived from knockout round counts

### Files to create/update
- `src/simulation/tournament.js` ✅ — `deriveGroups` (Union-Find), `getTournamentConfig`
- `src/simulation/simulationWorker.js` 🔄 — add `runTournamentSimulation`, keep `runLeagueSimulation`
- `src/parts/SimulationView.jsx` 🔄 — tournament data prep, tournament results UI
- `src/parts/SimulationView.css` 🔄 — group cards, knockout table styles

---

## 6. Long-term params from historical JSON ⬜

`wc26-matches.json` contains historical friendly/qualifier results per national team (attack, defense, form). Integrate as the long-term baseline for WM26 team params, blended with any in-tournament results via the existing `α` moving average.

**Planned approach:**
- Load `public/data/wc26-params.json` (pre-processed from `wc26-matches.json`) on SimulationView open when league = wm26
- Use as `longTermParams` fallback in `computeTeamParams` instead of defaulting to 1.0/1.0

---

## Key architectural decisions

| Decision | Rationale |
|---|---|
| Web Worker for simulation | Keeps UI responsive during 10k-path run |
| EMA param update per simulated match | Generates realistic up/down streaks within each path |
| `teamIds` from season matches, not Redux teams | Avoids including teams from other loaded leagues |
| Always call `fetchLeagues()` on init | Prevents localStorage-cached league list from surviving config changes |
| Poisson RNG (Knuth algorithm) | Simple, correct for λ < 30 (all realistic goal expectations) |
| Union-Find for group derivation | No hardcoded group assignments; works for any tournament structure |
| Protection bracket seeding | Seeds 1 and 2 can only meet in the Final; realistic title favorite simulation |
