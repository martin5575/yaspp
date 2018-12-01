import { Match } from "./types/openligadb";

export const sum: (numbers: number[]) => number = array =>
  array.reduce((res, x) => res + x, 0);

export const asPercentage: (val: number, digits?: number) => string = (
  val,
  digits = 2
) => (val * 100).toFixed(digits) + "%";

export const load: (league: string, season: number) => Match[] = (
  league,
  season
) => require(`./download/${league}/${season}`);

export const loadAll: (leagues: string[], seasons: number[]) => Match[] = (
  leagues,
  seasons
) => {
  let result: Match[] = [];
  for (let i: number = 0; i < leagues.length; ++i) {
    const league: string = leagues[i];
    for (let j: number = 0; j < seasons.length; ++j) {
      const season: number = seasons[i];
      result = [...result, ...load(league, season)];
    }
  }
  return result;
};

export const createMinutesLabel: (
  i: number,
  n: number,
  minutes: number
) => string = (i, n, minutes) =>
  `${minutes * i}-${i + 1 === n ? "OT" : minutes * (i + 1)}`;
