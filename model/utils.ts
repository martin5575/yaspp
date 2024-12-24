import { Match } from "./types/openligadb";

export const sum: (numbers: number[]) => number = (array) =>
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
) => string = (i, n, minutes) => {
  const start = minutes * i;
  const end = i + 1 === n ? "OT" : minutes * (i + 1);
  return `${padLeft(start, 2)}-${padLeft(end, 2)}`;
};

/**
 * Pads the given string or number with the specified character on the left side until the desired length is reached.
 * @param value - The string or number to pad.
 * @param length - The desired length of the resulting string.
 * @param char - The character to pad with. Defaults to '0'.
 * @returns The padded string.
 */
export const padLeft = (
  value: string | number,
  length: number,
  char: string = "0"
): string => {
  const str = String(value);
  return str.length >= length ? str : char.repeat(length - str.length) + str;
};
