import { calcResultProbs, calcWinLossTieProbs } from './probabilities'

// @ts-ignore
test('zero prob, zero length, ie prob for 0:0 only', () => {
  const simple = calcResultProbs(0, 0, 0)
  // @ts-ignore
  expect(simple.length).toEqual(1)
})

// @ts-ignore
test('zero prob, length one, ie probs for 0:0, 0:1, 1:0, 1:1', () => {
  const probs = calcResultProbs(0, 0, 1)
  // @ts-ignore
  expect(probs.length).toEqual(2)
})

// @ts-ignore
test('zero prob, length (default) 20, ie probs from 0:0 to 20:20', () => {
  const probs = calcResultProbs(0, 0)
  // @ts-ignore
  expect(probs.length).toEqual(21)
})

// @ts-ignore
test('probs home=2 and away=1, length=4, ie probs from 0:0 to 4:4', () => {
  const probs = calcResultProbs(2, 1, 4)
  // @ts-ignore
  expect(probs.length).toEqual(5)
  // @ts-ignore
  expect(probs[0][0]).toBeCloseTo(0.05, 2)
  // @ts-ignore
  expect(probs[0][1]).toBeCloseTo(0.05, 2)
  // @ts-ignore
  expect(probs[0][2]).toBeCloseTo(0.025, 2)
  // @ts-ignore
  expect(probs[1][0]).toBeCloseTo(0.1, 2)
  // @ts-ignore
  expect(probs[1][1]).toBeCloseTo(0.1, 2)
  // @ts-ignore
  expect(probs[1][2]).toBeCloseTo(0.05, 2)
  // @ts-ignore
  expect(probs[2][0]).toBeCloseTo(0.1, 2)
  // @ts-ignore
  expect(probs[2][1]).toBeCloseTo(0.1, 2)
  // @ts-ignore
  expect(probs[2][2]).toBeCloseTo(0.05, 2)
  // @ts-ignore
  expect(probs[3][0]).toBeCloseTo(0.066, 2)
  // @ts-ignore
  expect(probs[3][1]).toBeCloseTo(0.066, 2)
  // @ts-ignore
  expect(probs[3][2]).toBeCloseTo(0.033, 2)
})

// @ts-ignore
test('1-0-2 probs home=2 and away=1, ie probs for win, tie, loss', () => {
  const resultProbs = calcWinLossTieProbs(2, 1)
  // @ts-ignore
  expect(resultProbs.win).toBeCloseTo(0.605, 2)
  // @ts-ignore
  expect(resultProbs.tie).toBeCloseTo(0.211, 2)
  // @ts-ignore
  expect(resultProbs.loss).toBeCloseTo(0.182, 2)
})
