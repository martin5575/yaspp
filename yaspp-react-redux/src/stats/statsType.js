export const TotalGoalsVsTotalGoals = "tg_vs_tg"
export const TotalGoalsVsTotalGoalsWithDefenseFactor = "tgdf_vs_tgdf"
export const HomeGoalsVsAwayGoals = "hg_vs_ag"
export const HomeGoalsVsAwayGoalsWithDefenseFactor = "hgdf_vs_agdf"
export const TwoToOne = "2_1"
export const OneToZero = "1_0"
export const OneToOne = "1_1"
export const TotalPointsVsTotalPoints = "tp_vs_tp"

export const getKeys = () => {     
    return [
        TotalGoalsVsTotalGoals,
        TotalGoalsVsTotalGoalsWithDefenseFactor,
        HomeGoalsVsAwayGoals,
        HomeGoalsVsAwayGoalsWithDefenseFactor,
        TotalPointsVsTotalPoints,
        TwoToOne,
        OneToZero,
        OneToOne
    ]
}

const definitions = [
    {
        key: TotalGoalsVsTotalGoals,
        short: "t-t",
        description: "Zur Bestimmung der Torwahrscheinlichkeit der beiden Mannschaften werden jeweils alle Tore (heim & auswärts) genutzt."
    },
    {
        key: TotalGoalsVsTotalGoalsWithDefenseFactor,
        short: "t-t*",
        description: "Zur Bestimmung der Torwahrscheinlichkeit der beiden Mannschaften werden jeweils alle Tore (heim & auswärts) genutzt. Zusätzlich wird die Verteidigungsstärke der gegnerischen Mannschaft berücksichtigt."
    },    {
        key: HomeGoalsVsAwayGoals,
        short: "h-a",
        description: "Zur Bestimmung der Torwahrscheinlichkeit der Heimmannschaft werden nur die Heimtore genutzt und für die Auswärtsmannschaft die Auswärtstore."
    },
    {
        key: HomeGoalsVsAwayGoalsWithDefenseFactor,
        short: "h-a*",
        description: "Zur Bestimmung der Torwahrscheinlichkeit der Heimmannschaft werden nur die Heimtore genutzt und für die Auswärtsmannschaft die Auswärtstore. Zusätzlich wird die Verteidigungsstärke der gegnerischen Mannschaft berücksichtigt."
    },
    {
        key: TwoToOne,
        short: "2:1",
        description: "Feste Erwartung der Tore: Heim 2, Auswärts 1",
        isFixed: true
    },
    {
        key: OneToZero,
        short: "1:0",
        description: "Feste Erwartung der Tore: Heim 1, Auswärts 0",
        isFixed: true
    },
    {
        key: OneToOne,
        short: "1:1",
        description: "Feste Erwartung der Tore: Heim 1, Auswärts 1",
        isFixed: true
    },
    {
        key: TotalPointsVsTotalPoints,
        short: "p-p",
        description: "Feste Erwartung der Tore anhand der Tabellenposition. Annahme 2:1 für den besser platzierten",
        isFixed: true
    }
]

const find = (key) => definitions.find(x=>x.key===key)

export const getDescription = (key) => {
    const item = find(key)
    return item ? item.description : ""
}

export const getShort = (key) => {
    const item = find(key)
    return item ? item.short : ""
}

export const getNextId = (currentId) => ++currentId % definitions.length

export const getKey = (currentId) => definitions[currentId].key