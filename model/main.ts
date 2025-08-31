import { Match } from "./types/openligadb";
import { load, loadAll } from "./utils";
import {
  ITotalGoalsPerSection,
  IGoalsPerSection,
  IGoalsPerSectionAndDifference,
} from "./types/analyzing";
import {
  calcTotalGoalsPerSection,
  printTotalGoalsPerSection,
  calcGoalsPerSection,
  printGoalsPerSection,
  calcGoalsPerSectionAndDifference,
  printGoalsByTimeAndGoalDifference,
  printGoalsByTimeAndGoalDifferenceTable,
  printTransitionMatrix,
  ITransitionMatrixRow,
  calcTransitionMatrix,
  printSimulationResult,
  simulate,
} from "./analyzer";

const minutes: number = 5;
const league: string = "bl1";
const season: number = 2015; // 2009

const matches: Match[] = loadAll(
  ["bl1", /*"bl2"*/],
//  [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]
    [2018, 2019, 2020, 2021, 2022, /*2023*/]
);

const totalGoalDistribution: ITotalGoalsPerSection = calcTotalGoalsPerSection(
  matches,
  minutes
);
printTotalGoalsPerSection(totalGoalDistribution);

const goalDistribution: IGoalsPerSection = calcGoalsPerSection(matches, minutes);
printGoalsPerSection(goalDistribution);

const goalDistributionDifference: IGoalsPerSectionAndDifference =
  calcGoalsPerSectionAndDifference(matches, minutes);
printGoalsByTimeAndGoalDifferenceTable(goalDistributionDifference);

const transitionMatrix: ITransitionMatrixRow[] = calcTransitionMatrix(
  matches,
  minutes,
  30
);
printTransitionMatrix(transitionMatrix);

const simulationResult = simulate(transitionMatrix, minutes, 100);
printSimulationResult(simulationResult);