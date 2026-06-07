const sortByDate = (matches) =>
  [...matches].sort((a, b) => {
    const da = a.matchDateTime ? new Date(a.matchDateTime).getTime() : a.matchDayId
    const db = b.matchDateTime ? new Date(b.matchDateTime).getTime() : b.matchDayId
    return da - db
  })

const countStreak = (results, pred) => {
  let n = 0
  for (let i = results.length - 1; i >= 0; i--) {
    if (pred(results[i])) n++
    else break
  }
  return n
}

// Returns up to 3 fact objects {text, positive} for a single team.
// One per category: result streak / goals-for drought / goals-against streak.
// Only the longest qualifying streak per category is shown.
export function computeTeamFacts(teamId, allMatches, seasonInfo) {
  const sorted = sortByDate(
    (allMatches || []).filter(
      m => (m.teamHomeId === teamId || m.teamAwayId === teamId) && m.isFinished
    )
  )

  const results = sorted.map(m => {
    const isHome = m.teamHomeId === teamId
    const gf = isHome ? m.fullTimeHome : m.fullTimeAway
    const ga = isHome ? m.fullTimeAway : m.fullTimeHome
    return { gf: Number(gf) || 0, ga: Number(ga) || 0, win: Number(gf) > Number(ga), loss: Number(gf) < Number(ga) }
  })

  const streak = pred => countStreak(results, pred)
  const facts = []

  // ── Result streak ─────────────────────────────────────────────────────────
  const resultCandidates = [
    { n: streak(r => r.win),   label: n => `Siegesserie: ${n} Spiele in Folge`,  pos: true,  min: 2 },
    { n: streak(r => !r.loss), label: n => `Ungeschlagen: ${n} Spiele in Folge`, pos: true,  min: 3 },
    { n: streak(r => r.loss),  label: n => `${n} Niederlagen in Folge`,           pos: false, min: 2 },
    { n: streak(r => !r.win),  label: n => `${n} Spiele ohne Sieg`,               pos: false, min: 3 },
  ].filter(s => s.n >= s.min)

  if (resultCandidates.length) {
    const best = resultCandidates.sort((a, b) => b.n - a.n)[0]
    facts.push({ text: best.label(best.n), positive: best.pos })
  }

  // ── Goals-for drought ─────────────────────────────────────────────────────
  const gfCandidates = [
    { n: streak(r => r.gf === 0), label: n => `${n} Spiele ohne eigenes Tor`,     pos: false, min: 2 },
    { n: streak(r => r.gf <= 1),  label: n => `Max. 1 Tor erzielt: ${n} Spiele`,  pos: false, min: 3 },
  ].filter(s => s.n >= s.min)

  if (gfCandidates.length) {
    const best = gfCandidates.sort((a, b) => b.n - a.n)[0]
    facts.push({ text: best.label(best.n), positive: false })
  }

  // ── Goals-against streak ──────────────────────────────────────────────────
  const gaCandidates = [
    { n: streak(r => r.ga === 0), label: n => `${n} Spiele ohne Gegentor`,            pos: true, min: 2 },
    { n: streak(r => r.ga <= 1),  label: n => `Max. 1 Gegentor kassiert: ${n} Spiele`, pos: true, min: 3 },
  ].filter(s => s.n >= s.min)

  if (gaCandidates.length) {
    const best = gaCandidates.sort((a, b) => b.n - a.n)[0]
    facts.push({ text: best.label(best.n), positive: true })
  }

  return facts
}

// Returns top-5 / bottom-5 for attack and defense from seasonInfo.
// Each item: { team, rank, val }.
// Returns null when not enough data.
export function computeLeagueRankings(seasonInfo) {
  const withData = (seasonInfo || []).filter(x => x.tm > 0)
  if (withData.length < 3) return null

  const byAttack = [...withData].sort((a, b) => (b.tgf / b.tm) - (a.tgf / a.tm))
  const byDefense = [...withData].sort((a, b) => (a.tga / a.tm) - (b.tga / b.tm))

  const ranked = (arr, valFn) =>
    arr.map((t, i) => ({ team: t.team, rank: i + 1, val: valFn(t) }))

  const attackRanked = ranked(byAttack, t => t.tgf / t.tm)
  const defenseRanked = ranked(byDefense, t => t.tga / t.tm)

  return {
    topAttack: attackRanked.slice(0, 5),
    botAttack: attackRanked.slice(-5).reverse(),
    topDefense: defenseRanked.slice(0, 5),
    botDefense: defenseRanked.slice(-5).reverse(),
    total: withData.length,
  }
}
