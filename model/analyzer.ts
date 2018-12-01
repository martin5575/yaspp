import { sum, asPercentage, createMinutesLabel } from "./utils";
import { Goal, Match } from "./types/openligadb";
import {
  IGoalsPerDifference,
  ITotalGoalsPerSection,
  IGoalsPerSection,
  IGoalsPerSectionAndDifference
} from "./types/analyzing";

const initEmpty: (numberOfMinutes: number) => number[] = minutes => {
  let result: number[] = [];
  const count: number = Math.ceil(90 / minutes) + 1;
  for (let i: number = 0; i < count; ++i) {
    result.push(0);
  }
  return result;
};

const calcIndex: (
  realMinute: number,
  sectionSize: number,
  maxIndex: number
) => number = (real, size, max) => Math.min(Math.floor(real / size), max);

const calcTotalGoalsPerSection: (
  matchs: Match[],
  minutesPerSection: number
) => ITotalGoalsPerSection = (matchs, minutes) => {
  let goalsPerSection: number[] = initEmpty(minutes);
  const maxIndex: number = goalsPerSection.length - 1;

  for (let i: number = 0; i < matchs.length; ++i) {
    const match: Match = matchs[i];
    const goals: Goal[] = match.Goals;
    for (let j: number = 0; j < goals.length; ++j) {
      const goal: Goal = goals[j];
      const index: number = calcIndex(goal.MatchMinute, minutes, maxIndex);
      goalsPerSection[index] += 1;
    }
  }
  return { MinutesPerSection: minutes, TotalGoalsPerSection: goalsPerSection };
};

const printTotalGoalsPerSection: (
  goalsPerSection: ITotalGoalsPerSection
) => void = goalsPerSection => {
  const goals: number[] = goalsPerSection.TotalGoalsPerSection;
  const minutes: number = goalsPerSection.MinutesPerSection;
  const goalsSum: number = sum(goals);
  const n: number = goals.length;
  for (let i: number = 0; i < n; ++i) {
    console.log(
      `${createMinutesLabel(i, n, minutes)}:\tT: ${goals[i]} (${asPercentage(
        goals[i] / goalsSum
      )})`
    );
  }
};

const calcGoalsPerSection: (
  matchs: Match[],
  minutesPerSection: number
) => IGoalsPerSection = (matchs, minutes) => {
  let goalsPerSectionHome: number[] = initEmpty(minutes);
  let goalsPerSectionAway: number[] = initEmpty(minutes);
  const maxIndex: number = goalsPerSectionAway.length - 1;

  for (let i: number = 0; i < matchs.length; ++i) {
    const match: Match = matchs[i];
    const goals: Goal[] = match.Goals;
    let oldTd: number = 0;

    for (let j: number = 0; j < goals.length; ++j) {
      const goal: Goal = goals[j];
      const index: number = calcIndex(goal.MatchMinute, minutes, maxIndex);

      const newTd: number = goal.ScoreTeam1 - goal.ScoreTeam2;
      if (newTd > oldTd) {
        goalsPerSectionHome[index] += 1;
      } else {
        goalsPerSectionAway[index] += 1;
      }
      oldTd = newTd;
    }
  }
  return {
    MinutesPerSection: minutes,
    GoalsPerSectionHome: goalsPerSectionHome,
    GoalsPerSectionAway: goalsPerSectionAway
  };
};

const printGoalsPerSection: (
  goalsPerSection: IGoalsPerSection
) => void = goalsPerSection => {
  const goalsHome: number[] = goalsPerSection.GoalsPerSectionHome;
  const goalsAway: number[] = goalsPerSection.GoalsPerSectionAway;
  const minutes: number = goalsPerSection.MinutesPerSection;
  const goalsSum: number = sum(goalsHome) + sum(goalsAway);
  const n: number = goalsHome.length;
  for (let i: number = 0; i < n; ++i) {
    console.log(
      `${createMinutesLabel(i, n, minutes)}:\tH: ${
        goalsHome[i]
      } (${asPercentage(goalsHome[i] / goalsSum)})\tA: ${
        goalsAway[i]
      } (${asPercentage(goalsAway[i] / goalsSum)})`
    );
  }
};

const initDifferenceRow: (
  difference: number,
  minutes: number
) => IGoalsPerDifference = (difference, minutes) => {
  const empty: number[] = initEmpty(minutes);
  const differenceTemplate: IGoalsPerDifference = {
    Difference: difference,
    Home: [...empty],
    Away: [...empty]
  };
  return differenceTemplate;
};

function findOrAdd<T>(
  array: T[],
  predicate: (x: T) => boolean,
  creator: () => T
): T {
  let row: T = array.find(x => predicate(x));
  if (row) {
    return row;
  }
  row = creator();
  array.push(row);
  return row;
}

const calcGoalsPerSectionAndDifference: (
  matchs: Match[],
  minutes: number
) => IGoalsPerSectionAndDifference = (matchs, minutes) => {
  let differenceRows: IGoalsPerDifference[] = [];

  for (let i: number = 0; i < matchs.length; ++i) {
    const match: Match = matchs[i];
    const goals: Goal[] = match.Goals;

    let oldDifference: number = 0;
    for (let j: number = 0; j < goals.length; ++j) {
      const goal: Goal = goals[j];
      let differenceRow: IGoalsPerDifference = findOrAdd(
        differenceRows,
        x => x.Difference === oldDifference,
        () => initDifferenceRow(oldDifference, minutes)
      );

      const maxIndex: number = differenceRow.Home.length - 1;
      const index: number = calcIndex(goal.MatchMinute, minutes, maxIndex);
      const newDifference: number = goal.ScoreTeam1 - goal.ScoreTeam2;

      if (newDifference > oldDifference) {
        differenceRow.Home[index] += 1;
      } else {
        differenceRow.Away[index] += 1;
      }

      oldDifference = newDifference;
    }
  }
  return {
    MinutesPerSection: minutes,
    GoalsPerDifference: differenceRows
  };
};

const sumGoalsByTimeAndGoalDifference: (
  goals: IGoalsPerDifference[]
) => number = goals => {
  return goals.reduce((res, x) => res + sum(x.Home) + sum(x.Away), 0);
};

const printGoalsByTimeAndGoalDifference: (
  goalsPerDifference: IGoalsPerSectionAndDifference
) => void = goalsPerDifference => {
  const minutes: number = goalsPerDifference.MinutesPerSection;
  let goals: IGoalsPerDifference[] = goalsPerDifference.GoalsPerDifference;
  goals.sort((a, b) => a.Difference - b.Difference);
  const goalsSum: number = sumGoalsByTimeAndGoalDifference(goals);
  for (let j: number = 0; j < goals.length; ++j) {
    const item: IGoalsPerDifference = goals[j];
    console.log(item.Difference);
    const n: number = item.Home.length;
    for (let i: number = 0; i < n; ++i) {
      console.log(
        `${createMinutesLabel(i, n, minutes)}:\tH: ${
          item.Home[i]
        } (${asPercentage(item.Home[i] / goalsSum)})\tA: ${
          item.Away[i]
        } (${asPercentage(item.Away[i] / goalsSum)})`
      );
    }
  }
};

const printGoalsByTimeAndGoalDifferenceTable: (
  goalsPerDifference: IGoalsPerSectionAndDifference
) => void = goalsPerDifference => {
  const minutes: number = goalsPerDifference.MinutesPerSection;
  let goals: IGoalsPerDifference[] = goalsPerDifference.GoalsPerDifference;
  goals.sort((a, b) => a.Difference - b.Difference);
  const goalsSum: number = sumGoalsByTimeAndGoalDifference(goals);

  const n: number = goals[0].Home.length;
  const header: string = goals.reduce(
    (res, x) => `${res}\t\t${x.Difference}`,
    "\t"
  );
  console.log(header);
  for (let i: number = 0; i < n; ++i) {
    const row: string = goals.reduce(
      (res, x) =>
        `${res}\t${asPercentage(x.Home[i] / goalsSum)}-${asPercentage(
          x.Away[i] / goalsSum
        )}`,
      `${createMinutesLabel(i, n, minutes)}:\t`
    );
    console.log(row);
  }
};

export {
  calcTotalGoalsPerSection,
  printTotalGoalsPerSection,
  calcGoalsPerSection,
  printGoalsPerSection,
  calcGoalsPerSectionAndDifference,
  printGoalsByTimeAndGoalDifference,
  printGoalsByTimeAndGoalDifferenceTable
};
