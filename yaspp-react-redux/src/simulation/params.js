export function getLeagueAvg(playedMatches) {
  if (!playedMatches.length) return 1.3;
  const total = playedMatches.reduce(
    (s, m) => s + (m.fullTimeHome || 0) + (m.fullTimeAway || 0), 0
  );
  return total / (2 * playedMatches.length);
}

// Returns { teamParams: { id: { attack, defense } }, leagueAvg }
// attack = goals scored per game / league avg  (>1 = strong attack)
// defense = goals conceded per game / league avg  (>1 = weak defense)
export function computeTeamParams(allMatches, teamIds, { alpha = 0.4, recentN = 10 } = {}) {
  const played = allMatches.filter(m => m.isFinished);
  const avg = getLeagueAvg(played);

  const params = {};
  for (const id of teamIds) {
    const tm = played
      .filter(m => m.teamHomeId === id || m.teamAwayId === id)
      .sort((a, b) => new Date(b.matchDateTime) - new Date(a.matchDateTime));

    const recent = tm.slice(0, recentN);
    if (!recent.length) {
      params[id] = { attack: 1.0, defense: 1.0 };
      continue;
    }

    let scored = 0, conceded = 0;
    for (const m of recent) {
      scored   += m.teamHomeId === id ? (m.fullTimeHome || 0) : (m.fullTimeAway || 0);
      conceded += m.teamHomeId === id ? (m.fullTimeAway || 0) : (m.fullTimeHome || 0);
    }

    params[id] = {
      attack:  avg > 0 ? (scored  / recent.length) / avg : 1.0,
      defense: avg > 0 ? (conceded / recent.length) / avg : 1.0,
    };
  }

  return { teamParams: params, leagueAvg: avg };
}

// Leagues that are knockout/group tournaments rather than home-and-away leagues
export function isTournamentLeague(leagueId) {
  return /^(wm|wc|em|euro|copa|ucl|uel)/i.test(leagueId || '');
}

// Known host nation name fragments per tournament ID
const HOST_TERMS = {
  wm26: ['usa', 'united states', 'vereinigte staaten', 'kanada', 'canada', 'mexiko', 'mexico'],
};

export function detectHostNations(teams, teamIds, leagueId) {
  const terms = HOST_TERMS[(leagueId || '').toLowerCase()] || [];
  if (!terms.length) return [];
  return teamIds.filter(id => {
    const t = teams[id] || {};
    const haystack = `${t.name || ''} ${t.shortName || ''}`.toLowerCase();
    return terms.some(term => haystack.includes(term));
  });
}

// Returns the IDs of all teams that appear in the given season matches
export function getSeasonTeamIds(seasonMatches) {
  const ids = new Set();
  for (const m of seasonMatches) {
    if (m.teamHomeId != null) ids.add(String(m.teamHomeId));
    if (m.teamAwayId != null) ids.add(String(m.teamAwayId));
  }
  return [...ids];
}

export function getRemainingMatches(seasonMatches) {
  return seasonMatches
    .filter(m => !m.isFinished)
    .sort((a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime));
}

export function getCurrentPoints(seasonMatches, teamIds) {
  const pts = Object.fromEntries(teamIds.map(id => [id, 0]));
  for (const m of seasonMatches) {
    if (!m.isFinished) continue;
    const hg = m.fullTimeHome || 0;
    const ag = m.fullTimeAway || 0;
    if (hg > ag)       pts[m.teamHomeId] = (pts[m.teamHomeId] || 0) + 3;
    else if (hg === ag) { pts[m.teamHomeId] = (pts[m.teamHomeId] || 0) + 1; pts[m.teamAwayId] = (pts[m.teamAwayId] || 0) + 1; }
    else               pts[m.teamAwayId] = (pts[m.teamAwayId] || 0) + 3;
  }
  return pts;
}
