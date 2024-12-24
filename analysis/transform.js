const _ = require("lodash");

function transform(data) {
  const matches = _.orderBy(data, ["MatchDateTime"], ["asc"]);
  const teams = _.uniq(matches.map((match) => match.team1.teamId));

  const results = teams
    .map((team) => {
      const teamMatches = matches.filter(
        (match) => match.team1.teamId === team || match.team2.teamId === team
      );
      let counter = 0;
      let totalGoalsFor = 0;
      let totalGoalsAgainst = 0;
      const results = teamMatches.map((match) => {
        const finalScore = match.matchResults?.find(
          (y) => y.resultName === "Endergebnis"
        );
        if (!finalScore) {
          console.error("No final score found for match:", match);
          return null;
        }
        const isHome = match.team1.teamId === team;
        const goalsFor = isHome
          ? finalScore.pointsTeam1
          : finalScore.pointsTeam2;
        const goalsAgainst = isHome
          ? finalScore.pointsTeam2
          : finalScore.pointsTeam1;
        const opponent = isHome ? match.team2.teamId : match.team1.teamId;
        const result =
          goalsFor > goalsAgainst
            ? "win"
            : goalsFor < goalsAgainst
            ? "loss"
            : "draw";
        const homeAway = isHome ? "home" : "away";
        const matchId = match.matchID;
        const totalGoalsBefore = totalGoalsFor;
        const totalGoalsAgainstBefore = totalGoalsAgainst;
        const totalGoalsBeforeAvg =
          counter === 0 ? 0 : totalGoalsBefore / counter;
        const totalGoalsAgainstBeforeAvg =
          counter === 0 ? 0 : totalGoalsAgainstBefore / counter;
        totalGoalsFor += goalsFor;
        totalGoalsAgainst += goalsAgainst;
        counter++;
        return {
          matchId,
          goalsFor,
          goalsAgainst,
          opponent,
          result,
          homeAway,
          counter: counter - 1,
          totalGoalsBefore,
          totalGoalsAgainstBefore,
          totalGoalsAgainstBeforeAvg: totalGoalsAgainstBeforeAvg,
          totalGoalsBeforeAvg: totalGoalsBeforeAvg,
        };
      });

      return {
        team,
        results: results.filter((x) => x),
      };
    })
    .filter((x) => x?.results?.length > 0);

  for (const result of results) {
    result.results.forEach((match) => {
      const matchAtOponent = results
        .find((r) => r.team === match.opponent)
        ?.results?.find((m) => m.matchId === match.matchId);
      if (!matchAtOponent) {
        console.error("No match found for opponent:", match);
      } else {
        match.opponentCounter = matchAtOponent.counter;
        match.opponentTotalGoalsBefore = matchAtOponent.totalGoalsBefore;
        match.opponentTotalGoalsAgainstBefore =
          matchAtOponent.totalGoalsAgainstBefore;
        match.opponentTotalGoalsBeforeAvg = matchAtOponent.totalGoalsBeforeAvg;
        match.opponentTotalGoalsAgainstBeforeAvg =
          matchAtOponent.totalGoalsAgainstBeforeAvg;
      }
    });
  }

  return results;
}

function flattenData(transformed) {
  const flattened = transformed.flatMap((team) => {
    return team.results.map((match) => {
      return {
        team: team.team,
        ...match,
      };
    });
  });

  return flattened;
}

function mapToOutput(filename, data) {
  return data.map((match) => {
    return {
        league: filename.split("_")[0],
        season: filename.split("_")[1].split(".")[0],
      matchId: match.matchId,
      goalsFor: match.goalsFor,
      goalsAgainst: match.goalsAgainst,
      totalGoalsBeforeAvg: match.totalGoalsBeforeAvg,
      totalGoalsAgainstBeforeAvg: match.totalGoalsAgainstBeforeAvg,
      opponentTotalGoalsBeforeAvg: match.opponentTotalGoalsBeforeAvg,
      opponentTotalGoalsAgainstBeforeAvg:
        match.opponentTotalGoalsAgainstBeforeAvg,
      //target: `${match.goalsFor}-${match.goalsAgainst}`,
    };
  });
}

function toCsv(data) {
  const headers = Object.keys(data[0]);
  const allItems = _.flatten(data);
  const csv = allItems.map((row) => headers.map((header) => row[header]).join(","));
  return [headers.join(","), ...csv].join("\n");
}

function convert(fileName) {
  const data = require(`./data/${fileName}`);
  const transformed = transform(data);
  const flattened = flattenData(transformed);
  const filterOutTooFewMatches = flattened.filter(
    (m) => m.counter > 4 && m.opponentCounter > 4
  );
  const withoutDuplicates = _.uniqBy(filterOutTooFewMatches, (m) => m.matchId);
  if (withoutDuplicates.length === 0) {
    console.error("No data found for", fileName);
    return null;
  }
  const csv = toCsv(mapToOutput(fileName, withoutDuplicates));
  return csv;
}

const fs = require("fs");
const files = fs.readdirSync("./data");
const fileNames = files.map((file) => file.split(".")[0]);
const csvs = fileNames.map((fileName) => convert(fileName)).filter((x) => x);
const header = csvs[0].split("\n")[0];
const csv = csvs.flatMap((c) => c.split("\n").slice(1)).join("\n");
fs.writeFileSync("./data/output.csv", [header, csv].join("\n"));
