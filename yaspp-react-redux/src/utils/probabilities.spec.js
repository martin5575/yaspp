import {
  calcResultProbs,
  calcWinLossTieProbs
} from './probabilities'

test('zero prob, zero length, ie prob for 0:0 only', () => {
  const simple = calcResultProbs(0, 0, 0)
  expect(simple.length).toEqual(1);
});

test('zero prob, length one, ie probs for 0:0, 0:1, 1:0, 1:1', () => {
  const probs = calcResultProbs(0, 0, 1)
  expect(probs.length).toEqual(2);
});

test('zero prob, length (default) 20, ie probs from 0:0 to 20:20', () => {
  const probs = calcResultProbs(0, 0)
  expect(probs.length).toEqual(21);
});

test('probs home=2 and away=1, length=4, ie probs from 0:0 to 4:4', () => {
  const probs = calcResultProbs(2, 1, 4)
  expect(probs.length).toEqual(5);
  expect(probs[0][0]).toBeCloseTo(0.05, 2);
  expect(probs[0][1]).toBeCloseTo(0.05, 2);
  expect(probs[0][2]).toBeCloseTo(0.025, 2);
  expect(probs[1][0]).toBeCloseTo(0.10, 2);
  expect(probs[1][1]).toBeCloseTo(0.10, 2);
  expect(probs[1][2]).toBeCloseTo(0.05, 2);
  expect(probs[2][0]).toBeCloseTo(0.10, 2);
  expect(probs[2][1]).toBeCloseTo(0.10, 2);
  expect(probs[2][2]).toBeCloseTo(0.05, 2);
  expect(probs[3][0]).toBeCloseTo(0.066, 2);
  expect(probs[3][1]).toBeCloseTo(0.066, 2);
  expect(probs[3][2]).toBeCloseTo(0.033, 2);
});

test('1-0-2 probs home=2 and away=1, ie probs for win, tie, loss', () => {
  const resultProbs = calcWinLossTieProbs(2, 1)
  expect(resultProbs.win).toBeCloseTo(0.605, 2);
  expect(resultProbs.tie).toBeCloseTo(0.211, 2);
  expect(resultProbs.loss).toBeCloseTo(0.182, 2);
});