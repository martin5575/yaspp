export interface Group {
    GroupName: string;
    GroupOrderID: number;
    GroupID: number;
}

export interface Team {
    TeamId: number;
    TeamName: string;
    ShortName: string;
    TeamIconUrl: string;
    TeamGroupName?: any;
    Hashtag?: string
    Color1?: string
    Color2?: string
}

export interface MatchResult {
    ResultID: number;
    ResultName: string;
    PointsTeam1: number;
    PointsTeam2: number;
    ResultOrderID: number;
    ResultTypeID: number;
    ResultDescription: string;
}

export interface Goal {
    GoalID: number;
    ScoreTeam1: number;
    ScoreTeam2: number;
    MatchMinute?: number;
    GoalGetterID: number;
    GoalGetterName: string;
    IsPenalty: boolean;
    IsOwnGoal: boolean;
    IsOvertime: boolean;
    Comment?: any;
}

export interface Location {
    LocationID: number;
    LocationCity: string;
    LocationStadium: string;
}

export interface Match {
    MatchID: number;
    MatchDateTime: Date;
    TimeZoneID: string;
    LeagueId: number;
    LeagueName: string;
    MatchDateTimeUTC: Date;
    Group: Group;
    Team1: Team;
    Team2: Team;
    LastUpdateDateTime: Date;
    MatchIsFinished: boolean;
    MatchResults: MatchResult[];
    Goals: Goal[];
    Location: Location;
    NumberOfViewers?: any;
}

export interface Group {
    GroupID: number;
    GroupName: string;
    GroupOrderID: number;
}

export interface GoalGetter {
    GoalCount: number;
    GoalGetterId: number;
    GoalGetterName: string;
}

export interface BlTableTeam {
    Matches: number;
    Draw: number;
    Won: number;
    Goals: number;
    Lost: number;
    OpponentGoals: number;
    TeamIconUrl: string;
    TeamInfoId: number;
    TeamName: string;
    ShortName: string;
    Points: number;
}

