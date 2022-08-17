export interface AdditionalDataTeam {
    teamId: number;
    hashtag: string;
    color1: string;
    color2: string;
}

export interface AdditionalData {
    teams: AdditionalDataTeam[];
}