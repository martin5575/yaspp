export interface LeagueConfig {
    leaguesAndSeasons: LeagueAndSeasons[]
}

export interface LeagueAndSeasons {
    key: string,
    seasons: number[]
}