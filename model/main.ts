import { Match } from "./types/openligadb";
import { load, loadAll } from "./utils";
import {
  ITotalGoalsPerSection,
  IGoalsPerSection,
  IGoalsPerSectionAndDifference
} from "./types/analyzing";
import {
  calcTotalGoalsPerSection,
  printTotalGoalsPerSection,
  calcGoalsPerSection,
  printGoalsPerSection,
  calcGoalsPerSectionAndDifference,
  printGoalsByTimeAndGoalDifference,
  printGoalsByTimeAndGoalDifferenceTable
} from "./analyzer";

const minutes: number = 5;
const league: string = "bl1";
const season: number = 2015; // 2009

const matchs: Match[] = loadAll(
  ["bl1", "bl2"],
  [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]
);

const totalGoalDistribution: ITotalGoalsPerSection = calcTotalGoalsPerSection(
  matchs,
  minutes
);
printTotalGoalsPerSection(totalGoalDistribution);

const goalDistribution: IGoalsPerSection = calcGoalsPerSection(matchs, minutes);
printGoalsPerSection(goalDistribution);

const goalDistributionDifference: IGoalsPerSectionAndDifference = calcGoalsPerSectionAndDifference(
  matchs,
  minutes
);
printGoalsByTimeAndGoalDifferenceTable(goalDistributionDifference);
