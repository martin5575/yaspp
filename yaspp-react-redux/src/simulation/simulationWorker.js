/* eslint-disable no-restricted-globals */

// ─── Poisson RNG (Knuth) ──────────────────────────────────────────────────────

function poisson(lambda) {
  if (lambda <= 0) return 0;
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

// ─── Group standing (used by tournament mode) ─────────────────────────────────

// simResults: { [matchId]: { hg, ag } }  for not-yet-finished matches
function computeGroupStanding(teamIds, groupMatches, simResults) {
  const s = {};
  for (const id of teamIds) s[id] = { id, pts: 0, gf: 0, ga: 0, gd: 0 };

  for (const m of groupMatches) {
    const hid = String(m.teamHomeId);
    const aid = String(m.teamAwayId);
    let hg, ag;
    if (m.isFinished) {
      hg = m.fullTimeHome || 0; ag = m.fullTimeAway || 0;
    } else if (m.id in simResults) {
      hg = simResults[m.id].hg; ag = simResults[m.id].ag;
    } else continue;

    if (!s[hid] || !s[aid]) continue;
    s[hid].gf += hg; s[hid].ga += ag; s[hid].gd += hg - ag;
    s[aid].gf += ag; s[aid].ga += hg; s[aid].gd += ag - hg;
    if      (hg > ag) s[hid].pts += 3;
    else if (hg === ag) { s[hid].pts++; s[aid].pts++; }
    else               s[aid].pts += 3;
  }

  return Object.values(s).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd  !== a.gd)  return b.gd  - a.gd;
    if (b.gf  !== a.gf)  return b.gf  - a.gf;
    return Math.random() - 0.5; // random tiebreak on equal records
  });
}

// Returns up to n best third-place standing objects, sorted
function getBestThirds(thirds, n) {
  return [...thirds]
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd  !== a.gd)  return b.gd  - a.gd;
      return b.gf - a.gf || (Math.random() - 0.5);
    })
    .slice(0, n);
}

// ─── Knockout match (90 min + ET + pens) ─────────────────────────────────────

function simulateKnockoutMatch(hid, aid, p, leagueAvg, gamma) {
  const ph = p[hid], pa = p[aid];

  // 90 min — knockout matches played on neutral ground (adv = 1.0)
  let hg = poisson(Math.max(0.05, ph.attack * pa.defense * leagueAvg));
  let ag = poisson(Math.max(0.05, pa.attack * ph.defense * leagueAvg));

  // Extra time: ~30 min ≈ ⅓ of normal 90-min rate
  if (hg === ag) {
    hg += poisson(Math.max(0.01, ph.attack * pa.defense * leagueAvg / 3));
    ag += poisson(Math.max(0.01, pa.attack * ph.defense * leagueAvg / 3));
  }

  // Penalty shootout: 50/50
  const winnerId = hg > ag ? hid : hg < ag ? aid : (Math.random() < 0.5 ? hid : aid);
  const loserId  = winnerId === hid ? aid : hid;

  // EMA param update so recent form carries into next rounds
  const nH = hg / leagueAvg, nA = ag / leagueAvg;
  p[hid] = { attack: (1-gamma)*ph.attack + gamma*nH, defense: (1-gamma)*ph.defense + gamma*nA };
  p[aid] = { attack: (1-gamma)*pa.attack + gamma*nA, defense: (1-gamma)*pa.defense + gamma*nH };

  return { winnerId, loserId };
}

// ─── League simulation ────────────────────────────────────────────────────────

function runLeagueSimulation(data) {
  const { remainingMatches, currentPoints, teamParams, globalParams, nPaths } = data;
  const { homeAdvantage, hostAdvantage, hostNationIds, isTournament, leagueAvg, gamma } = globalParams;
  const hostSet = new Set((hostNationIds || []).map(String));

  const teamIds = Object.keys(teamParams);
  const nTeams  = teamIds.length;
  const finalPoints = {};
  for (const id of teamIds) finalPoints[id] = new Array(nPaths);

  for (let path = 0; path < nPaths; path++) {
    const pts = {}, p = {};
    for (const id of teamIds) { pts[id] = currentPoints[id] || 0; p[id] = { ...teamParams[id] }; }

    for (const m of remainingMatches) {
      const hid = String(m.teamHomeId), aid = String(m.teamAwayId);
      const ph = p[hid], pa = p[aid];
      if (!ph || !pa) continue;

      let adv;
      if (isTournament) {
        adv = hostSet.has(hid) ? hostAdvantage : hostSet.has(aid) ? 1 / hostAdvantage : 1;
      } else {
        adv = homeAdvantage;
      }

      const lH = Math.max(0.05, ph.attack * pa.defense * adv * leagueAvg);
      const lA = Math.max(0.05, pa.attack * ph.defense / adv * leagueAvg);
      const hg = poisson(lH), ag = poisson(lA);

      if      (hg > ag) pts[hid] += 3;
      else if (hg === ag) { pts[hid]++; pts[aid]++; }
      else               pts[aid] += 3;

      const nH = hg / leagueAvg, nA = ag / leagueAvg;
      p[hid] = { attack: (1-gamma)*ph.attack + gamma*nH, defense: (1-gamma)*ph.defense + gamma*nA };
      p[aid] = { attack: (1-gamma)*pa.attack + gamma*nA, defense: (1-gamma)*pa.defense + gamma*nH };
    }

    for (const id of teamIds) finalPoints[id][path] = pts[id];
    if ((path + 1) % 200 === 0)
      self.postMessage({ type: 'progress', completed: path + 1, total: nPaths });
  }

  // Position counts & point stats
  const posCounts = {}, ptStats = {};
  for (const id of teamIds) {
    posCounts[id] = new Array(nTeams + 1).fill(0);
    ptStats[id]   = { min: Infinity, max: -Infinity, sum: 0 };
  }
  const buf = teamIds.map(id => ({ id, pts: 0 }));
  for (let path = 0; path < nPaths; path++) {
    for (let i = 0; i < nTeams; i++) buf[i].pts = finalPoints[teamIds[i]][path];
    buf.sort((a, b) => b.pts - a.pts);
    for (let pos = 0; pos < nTeams; pos++) {
      const { id, pts } = buf[pos];
      posCounts[id][pos + 1]++;
      ptStats[id].sum += pts;
      if (pts < ptStats[id].min) ptStats[id].min = pts;
      if (pts > ptStats[id].max) ptStats[id].max = pts;
    }
  }

  const results = {};
  for (const id of teamIds) {
    results[id] = {
      positionCounts: posCounts[id],
      avgPoints: Math.round(ptStats[id].sum / nPaths * 10) / 10,
      minPoints: ptStats[id].min,
      maxPoints: ptStats[id].max,
    };
  }
  self.postMessage({ type: 'result', results, nPaths, nTeams, isTournament: false });
}

// ─── Tournament simulation ────────────────────────────────────────────────────

function runTournamentSimulation(data) {
  const { groupsWithMatches, nPaths, teamParams, globalParams } = data;
  const { hostAdvantage, hostNationIds, leagueAvg, gamma, nBestThirds = 8 } = globalParams;
  const hostSet = new Set((hostNationIds || []).map(String));

  const allTeamIds = groupsWithMatches.flatMap(g => g.teamIds);

  // Accumulators
  // groupPos[id] = [cnt_1st, cnt_2nd, cnt_3rd, cnt_4th]
  const groupPos = {};
  // rounds[id] = { groupExit, R32, R16, QF, SF, Final, Champion }
  const rounds = {};
  for (const id of allTeamIds) {
    groupPos[id] = [0, 0, 0, 0];
    rounds[id]   = { groupExit: 0, R32: 0, R16: 0, QF: 0, SF: 0, Final: 0, Champion: 0 };
  }

  const ROUND_NAMES = ['R32', 'R16', 'QF', 'SF', 'Final'];

  for (let path = 0; path < nPaths; path++) {
    // Copy team params for this path (will evolve via EMA)
    const p = {};
    for (const id of allTeamIds) p[id] = { ...(teamParams[id] || { attack: 1, defense: 1 }) };

    // ── 1. Simulate remaining group matches ──────────────────────────────────
    const simResults = {};
    for (const group of groupsWithMatches) {
      for (const m of group.matches) {
        if (m.isFinished) continue;
        const hid = String(m.teamHomeId), aid = String(m.teamAwayId);
        if (!p[hid] || !p[aid]) continue;

        const adv = hostSet.has(hid) ? hostAdvantage : hostSet.has(aid) ? 1/hostAdvantage : 1;
        const lH = Math.max(0.05, p[hid].attack * p[aid].defense * adv * leagueAvg);
        const lA = Math.max(0.05, p[aid].attack * p[hid].defense / adv * leagueAvg);
        const hg = poisson(lH), ag = poisson(lA);
        simResults[m.id] = { hg, ag };

        const ph = p[hid], pa = p[aid];
        const nH = hg/leagueAvg, nA = ag/leagueAvg;
        p[hid] = { attack: (1-gamma)*ph.attack + gamma*nH, defense: (1-gamma)*ph.defense + gamma*nA };
        p[aid] = { attack: (1-gamma)*pa.attack + gamma*nA, defense: (1-gamma)*pa.defense + gamma*nH };
      }
    }

    // ── 2. Compute group standings ───────────────────────────────────────────
    const standings = groupsWithMatches.map(g =>
      computeGroupStanding(g.teamIds, g.matches, simResults)
    );

    // ── 3. Record group positions ────────────────────────────────────────────
    for (const s of standings) {
      for (let pos = 0; pos < Math.min(s.length, 4); pos++) {
        groupPos[s[pos].id][pos]++;
      }
    }

    // ── 4. Determine qualifiers ──────────────────────────────────────────────
    const firsts  = standings.map(s => s[0]);
    const seconds = standings.map(s => s[1]);
    const thirds  = standings.map(s => s[2]).filter(Boolean);

    const bestThirds    = getBestThirds(thirds, nBestThirds);
    const bestThirdIds  = new Set(bestThirds.map(t => t.id));

    // Mark group-stage exits (4th place + non-qualifying 3rds)
    for (const s of standings) {
      if (s[3]) rounds[s[3].id].groupExit++;
      if (s[2] && !bestThirdIds.has(s[2].id)) rounds[s[2].id].groupExit++;
    }

    // ── 5. Seed 32 qualified teams ────────────────────────────────────────────
    const rankBy = (a, b) =>
      (b.pts - a.pts) || (b.gd - a.gd) || (b.gf - a.gf) || (Math.random() - 0.5);

    const sortedFirsts  = [...firsts].sort(rankBy);
    const sortedSeconds = [...seconds].sort(rankBy);
    // bestThirds already sorted by getBestThirds

    // Seeds 1-12: group winners, 13-24: runners-up, 25-32: best thirds
    const qualified = [
      ...sortedFirsts.map(t => t.id),
      ...sortedSeconds.map(t => t.id),
      ...bestThirds.map(t => t.id),
    ];

    // ── 6. Simulate knockout bracket ─────────────────────────────────────────
    // Standard protection bracket: team[i] vs team[n−1−i] in each round.
    // Winners collected in order → same pattern applied next round.
    // Seeds 1 & 2 cannot meet until the Final.

    let current = qualified;
    for (let r = 0; r < ROUND_NAMES.length && current.length > 1; r++) {
      const roundName = ROUND_NAMES[r];
      const next = [];
      const n = current.length;
      for (let i = 0; i < n / 2; i++) {
        const hid = current[i];
        const aid = current[n - 1 - i];
        if (!p[hid] || !p[aid]) {
          // bye: whichever has valid params advances
          next.push(p[hid] ? hid : aid);
          continue;
        }
        const { winnerId, loserId } = simulateKnockoutMatch(hid, aid, p, leagueAvg, gamma);
        rounds[loserId][roundName]++;
        next.push(winnerId);
      }
      current = next;
    }
    if (current.length === 1) rounds[current[0]].Champion++;

    if ((path + 1) % 200 === 0)
      self.postMessage({ type: 'progress', completed: path + 1, total: nPaths });
  }

  const results = {};
  for (const id of allTeamIds) {
    results[id] = { groupPos: groupPos[id], rounds: rounds[id] };
  }
  self.postMessage({ type: 'result', results, nPaths, isTournament: true });
}

// ─── Entry point ──────────────────────────────────────────────────────────────

self.onmessage = function (e) {
  if (e.data.isTournament) runTournamentSimulation(e.data);
  else                     runLeagueSimulation(e.data);
};
