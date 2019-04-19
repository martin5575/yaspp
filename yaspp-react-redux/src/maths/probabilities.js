const faculty = (k) => {
  let r = 1.0
  for (let i = 1; i <= k; ++i) {
    r *= i
  }
  return r
}

const poissonProbability = (lambda, k) => {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / faculty(k)
}

export const calcLossProbs = (probs) => {
  let probSum = 0.0
  const n = probs.length
  for (let i = 0; i < n; ++i) {
    for (let j = i + 1; j < n; ++j) {
      probSum += probs[i][j]
    }
  }
  return probSum
}

export const calcWinProbs = (probs) => {
  let probSum = 0.0
  const n = probs.length
  for (let i = 1; i < n; ++i) {
    for (let j = 0; j < i; ++j) {
      probSum += probs[i][j]
    }
  }
  return probSum
}

export const calcTieProbs = (probs) => {
  let probSum = 0.0
  const n = probs.length
  for (let i = 0; i < n; ++i) {
    probSum += probs[i][i]
  }
  return probSum
}

export const calcWinLossTieProbs = (hg, ag) => {
  const probs = calcResultProbs(hg, ag)
  return {
    win: calcWinProbs(probs),
    tie: calcTieProbs(probs),
    loss: calcLossProbs(probs),
  }
}

export const calcResultProbs = (hg, ag, n = 20) => {
  const epsilon = 1e-4
  const hgf = (hg ? hg : 0.0) + epsilon
  const agf = (ag ? ag : 0.0) + epsilon

  let result = []
  for (let i = 0; i <= n; ++i) {
    let row = []
    for (let j = 0; j <= n; ++j) {
      row.push(poissonProbability(hgf, i) * poissonProbability(agf, j))
    }
    result.push(row)
  }
  return result
}

const formatNumber = (n, digits) => (n ? n.toFixed(digits) : '-')

export const formatPercentage = (n, digits = 0) =>
  n ? (n * 100.0).toFixed(digits) + '%' : '-'

export const formatProbs = (probs, n = 2) => {
  return `${formatPercentage(probs.win, n)}/${formatPercentage(
    probs.tie,
    n
  )}/${formatPercentage(probs.loss, n)}`
}

export const formatRate = (n, digits = 1) =>
  n ? Math.min(99.9, 1.0 / n).toFixed(digits) : '-'

export const getProbDescription = (hg, ag) => {
  const results = calcResultProbs(hg, ag)
  let content = ''
  for (let i = 0; i <= 5; ++i) {
    for (let j = 0; j <= 5; ++j) {
      if (i + j > 6) continue
      content += `<b>${i}:${j}</b> ${formatPercentage(results[i][j])}<br/>`
    }
  }
  return `<div>${content}</div>`
}
