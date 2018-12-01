export interface IGoalsPerSectionAndDifference {
  MinutesPerSection: number;
  GoalsPerDifference: IGoalsPerDifference[];
}

export interface IGoalsPerDifference {
  Difference: number;
  Home: number[];
  Away: number[];
}
