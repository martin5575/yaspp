import {calcResultProbs} from './probabilities'

test('zero prob, zero length', () => {
  const simple = calcResultProbs(0,0,0)
  expect(simple.length).toEqual(1);
});

test('zero prob, length one', () => {
  const length2 = calcResultProbs(0,0,1)
  console.log(length2)
  expect(length2.length).toEqual(2);
});