export const TotalGoalsVsTotalGoals = "tg_vs_tg"
export const TotalGoalsVsTotalGoalsWithDefenseFactor = "tgdf_vs_tgdf"
export const HomeGoalsVsAwayGoals = "hg_vs_ag"
export const HomeGoalsVsAwayGoalsWithDefenseFactor = "hgdf_vs_agdf"
//export const TotalPointsVsTotalPoints = "tp_vs_tp"

export const getKeys = () => {
    [
        TotalGoalsVsTotalGoals,
        TotalGoalsVsTotalGoalsWithDefenseFactor,
        HomeGoalsVsAwayGoals,
        HomeGoalsVsAwayGoalsWithDefenseFactor
    ]
}

const definitions = [
    {
        key: TotalGoalsVsTotalGoals,
        short: "t-t",
        description: "Zur Bestimmung der Torwahrscheinlichkeit der beiden Mannschaften werden jeweils alle Tore (heim & auswärts) genutzt."
    },
    {
        key: HomeGoalsVsAwayGoals,
        short: "h-a",
        description: "Zur Bestimmung der Torwahrscheinlichkeit der Heimmannschaft werden nur die Heimtore genutzt und für die Auswärtsmannschaft die Auswärtstore."
    },
    {
        key: TotalGoalsVsTotalGoals,
        short: "t-t*",
        description: "Zur Bestimmung der Torwahrscheinlichkeit der beiden Mannschaften werden jeweils alle Tore (heim & auswärts) genutzt. Zusätzlich wird die Verteidigungsstärke der gegnerischen Mannschaft berücksichtigt."
    },
    {
        key: HomeGoalsVsAwayGoals,
        short: "h-a*",
        description: "Zur Bestimmung der Torwahrscheinlichkeit der Heimmannschaft werden nur die Heimtore genutzt und für die Auswärtsmannschaft die Auswärtstore. Zusätzlich wird die Verteidigungsstärke der gegnerischen Mannschaft berücksichtigt."
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