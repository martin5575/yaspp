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

export const calcLossProbs = (hgf, agf, n) => {
  let probSum = 0.0
  for (let i = 0; i <= n; ++i) {
    for (let j = i + 1; j <= n; ++j) {
      probSum += poissonProbability(hgf, i) * poissonProbability(agf, j)
    }
  }
  return probSum
}
export const calcWinProbs = (hgf, agf, n) => {
  let probSum = 0.0
  for (let i = 1; i <= n; ++i) {
    for (let j = 0; j < i; ++j) {
      probSum += poissonProbability(hgf, i) * poissonProbability(agf, j)
    }
  }
  return probSum
}
export const calcTieProbs = (hgf, agf, n) => {
  let probSum = 0.0
  for (let i = 0; i <= n; ++i) {
    probSum += poissonProbability(hgf, i) * poissonProbability(agf, i)
  }
  return probSum
}

export const calcWinLossTieProbs = (hg, ag) => {
  const n = 20
  const epsilon = 1e-4
  const hgf = (hg ? hg : 0.0) + epsilon
  const agf = (ag ? ag : 0.0) + epsilon
  return {
    win: calcWinProbs(hgf, agf, n),
    loss: calcLossProbs(hgf, agf, n),
    tie: calcTieProbs(hgf, agf, n),
  }
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
