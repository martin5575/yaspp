import { sum, asPercentage, createMinutesLabel, padLeft } from "./utils";
import { Goal, Match } from "./types/openligadb";
import {
  IGoalsPerDifference,
  ITotalGoalsPerSection,
  IGoalsPerSection,
  IGoalsPerSectionAndDifference,
} from "./types/analyzing";

const initEmpty: (numberOfMinutes: number) => number[] = (minutes) => {
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
) => void = (goalsPerSection) => {
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
    GoalsPerSectionAway: goalsPerSectionAway,
  };
};

const printGoalsPerSection: (goalsPerSection: IGoalsPerSection) => void = (
  goalsPerSection
) => {
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
    Away: [...empty],
  };
  return differenceTemplate;
};

function findOrAdd<T>(
  array: T[],
  predicate: (x: T) => boolean,
  creator: () => T
): T {
  let row: T | undefined = array.find((x) => predicate(x));
  if (row) {
    return row;
  }
  row = creator();
  array.push(row);
  return row;
}

const calcGoalsPerSectionAndDifference: (
  matches: Match[],
  minutes: number
) => IGoalsPerSectionAndDifference = (matches, minutes) => {
  let differenceRows: IGoalsPerDifference[] = [];

  for (let i: number = 0; i < matches.length; ++i) {
    const match: Match = matches[i];
    const goals: Goal[] = match.Goals;

    let oldDifference: number = 0;
    for (let j: number = 0; j < goals.length; ++j) {
      const goal: Goal = goals[j];
      let differenceRow: IGoalsPerDifference = findOrAdd(
        differenceRows,
        (x) => x.Difference === oldDifference,
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
    GoalsPerDifference: differenceRows,
  };
};

const sumGoalsByTimeAndGoalDifference: (
  goals: IGoalsPerDifference[]
) => number = (goals) => {
  return goals.reduce((res, x) => res + sum(x.Home) + sum(x.Away), 0);
};

const printGoalsByTimeAndGoalDifference: (
  goalsPerDifference: IGoalsPerSectionAndDifference
) => void = (goalsPerDifference) => {
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
) => void = (goalsPerDifference) => {
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

const sumGoalsOfRow: (goals: IGoalsPerDifference[], i: number) => number = (
  goals,
  i
) => sum(goals.map((x) => x.Home[i] + x.Away[i]));

export type ITransitionProbabilities = {
  [key in "-1" | "0" | "1"]: number;
};

export interface ITransitionMatrixRow {
  timeIndex: number;
  startTime: number;
  endTime: number;
  goalDifference: number;
  probabilities: ITransitionProbabilities;
  count: number;
}

// for each 5min slice calculate the probability of goals in terms of -1, 0, 1
const calcTransitionMatrix: (
  matches: Match[],
  minutes: number,
  threshold: number
) => ITransitionMatrixRow[] = (matches, minutes, threshold) => {
  const T: number = Math.floor(90 / minutes) + 1;
  const transitionMatrix: ITransitionMatrixRow[] = [];

  for (let i: number = 0; i < matches.length; ++i) {
    const match: Match = matches[i];
    const goals: Goal[] = match.Goals.sort(
      (a, b) => a.MatchMinute - b.MatchMinute
    );

    let oldDifference: number = 0;
    let goalIndex: number = 0;
    for (let t: number = 0; t < T; ++t) {
      const startTime: number = t * minutes;
      const endTime: number = (t + 1) * minutes;
      let row: ITransitionMatrixRow | undefined = transitionMatrix.find(
        (x) => x.timeIndex === t && x.goalDifference === oldDifference
      );
      if (!row) {
        row = {
          timeIndex: t,
          startTime,
          endTime,
          goalDifference: oldDifference,
          probabilities: { "-1": 0, "0": 0, "1": 0 },
          count: 0,
        };
        transitionMatrix.push(row);
      }

      row.count += 1;
      const goal: Goal = goals[goalIndex];
      const timeIndex: number = goal
        ? calcIndex(goal.MatchMinute, minutes, T)
        : T + 1;
      const newDifference: number =
        timeIndex === t ? goal.ScoreTeam1 - goal.ScoreTeam2 : oldDifference;
      if (newDifference > oldDifference) {
        row.probabilities["1"] += 1;
      } else if (newDifference < oldDifference) {
        row.probabilities["-1"] += 1;
      } else {
        row.probabilities["0"] += 1;
      }

      if (goal && timeIndex === t) {
        goalIndex++;
      }
      oldDifference = newDifference;
    }
  }

  transitionMatrix.sort((a, b) => {
    if (a.timeIndex === b.timeIndex) {
      return a.goalDifference - b.goalDifference;
    }
    return a.timeIndex - b.timeIndex;
  });

  return transitionMatrix
    .filter((x) => x.count > threshold)
    .map((x) => ({
      ...x,
      probabilities: {
        "-1": x.probabilities["-1"] / x.count,
        "0": x.probabilities["0"] / x.count,
        "1": x.probabilities["1"] / x.count,
      },
    }));
};

const printTransitionMatrix: (
  transitionMatrix: ITransitionMatrixRow[]
) => void = (transitionMatrix) => {
  const displayRows: any[] = [];
  for (let i: number = 0; i < transitionMatrix.length; ++i) {
    const row: ITransitionMatrixRow = transitionMatrix[i];
    displayRows.push({
      time: createMinutesLabel(row.timeIndex, 19, 5),
      count: row.count,
      "+/-": row.goalDifference,
      "-1": asPercentage(row.probabilities["-1"]),
      "0": asPercentage(row.probabilities["0"]),
      "1": asPercentage(row.probabilities["1"]),
    });
  }
  printTable(displayRows, 8, ["time", "count", "+/-", "-1", "0", "1"]);
};

const printTable: (rows: any[], width: number, headers: string[]) => void = (
  rows,
  width,
  headers
) => {
  const pad = (x: any) => padLeft(x, width, " ");
  const header: string = headers.reduce((res, x) => `${res}\t${pad(x)}`, "");
  console.log(header);
  rows.forEach((row) => {
    const line: string = headers.reduce(
      (res, x) => `${res}\t${pad(row[x])}`,
      ""
    );
    console.log(line);
  });
};

const simulate: (
  transitionMatrix: ITransitionMatrixRow[],
  minutes: number,
  simulations: number
) => number[][] = (transitionMatrix, minutes, simulations) => {
  const T: number = Math.floor(90 / minutes) + 1;
  const result: number[][] = initEmpty(10).map(() => initEmpty(10));
  for (let i: number = 0; i < simulations; ++i) {
    simulateSingle(transitionMatrix, minutes, T, result);
  }
  return result;
};

const simulateSingle: (
  transitionMatrix: ITransitionMatrixRow[],
  minutes: number,
  T: number,
  result: number[][]
) => void = (transitionMatrix, minutes, T, result) => {
  let homeGoals: number = 0;
  let awayGoals: number = 0;
  let difference: number = 0;
  for (let t: number = 0; t < T; ++t) {
    const row: ITransitionMatrixRow =
      transitionMatrix.find(
        (x) => x.timeIndex === t && x.goalDifference === difference
      ) ??
      (difference < 0
        ? transitionMatrix.find(
          (x) => x.timeIndex === t && x.goalDifference === difference + 1
          )
        : transitionMatrix.find(
          (x) => x.timeIndex === t && x.goalDifference === difference - 1
          ))!;
    const probabilities: ITransitionProbabilities = row.probabilities;
    const random: number = Math.random();
    if (random < probabilities["-1"]) {
      awayGoals += 1;
      difference -= 1;
    } else if (random < probabilities["-1"] + probabilities["0"]) {
      difference = 0;
    } else {
      homeGoals += 1;
      difference += 1;
    }
  }
  result[homeGoals][awayGoals] += 1;
};

const printSimulationResult: (result: number[][]) => void = (result) => {
  const vals = result.map((x, i) => ({...x, "h/a": i}));
  printTable(vals, 6, ["h/a", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
};

export {
  calcTotalGoalsPerSection,
  printTotalGoalsPerSection,
  calcGoalsPerSection,
  printGoalsPerSection,
  calcGoalsPerSectionAndDifference,
  printGoalsByTimeAndGoalDifference,
  printGoalsByTimeAndGoalDifferenceTable,
  printTransitionMatrix,
  calcTransitionMatrix,
  simulate,
  printSimulationResult,
};
