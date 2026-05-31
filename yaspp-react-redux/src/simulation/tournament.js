// Derive which teams belong to each group using Union-Find on group-stage matches
export function deriveGroups(groupStageMatches) {
  const parent = {};
  function find(x) {
    if (!parent[x]) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a, b) {
    const pa = find(a), pb = find(b);
    if (pa !== pb) parent[pa] = pb;
  }
  for (const m of groupStageMatches) {
    if (m.teamHomeId && m.teamAwayId)
      union(String(m.teamHomeId), String(m.teamAwayId));
  }
  const buckets = {};
  for (const m of groupStageMatches) {
    const hid = String(m.teamHomeId);
    const root = find(hid);
    if (!buckets[root]) buckets[root] = new Set();
    buckets[root].add(hid);
    buckets[root].add(String(m.teamAwayId));
  }
  return Object.values(buckets)
    .map(s => [...s].sort())   // stable alphabetic sort of IDs within each group
    .filter(g => g.length >= 2)
    .sort((a, b) => a[0].localeCompare(b[0])); // stable group order
}

// Per-league tournament configuration
export function getTournamentConfig(leagueId) {
  const id = (leagueId || '').toLowerCase();
  if (id.startsWith('wm') || id.startsWith('wc'))
    return { nGroupRounds: 3, nBestThirds: 8, teamsPerGroup: 4 };
  if (id.startsWith('em') || id.startsWith('euro'))
    return { nGroupRounds: 3, nBestThirds: 4, teamsPerGroup: 4 };
  return null;
}
