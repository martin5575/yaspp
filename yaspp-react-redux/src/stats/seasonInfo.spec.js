import { aggregateSeasonInfo } from './seasonInfo'

const matchs = [{"id":51120,"teamHomeId":54,"teamAwayId":79,"matchDayId":1,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-08-27T12:22:57.107","matchDateTime":"2018-08-25T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":0},{"id":51121,"teamHomeId":40,"teamAwayId":123,"matchDayId":1,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-08-27T13:01:43.113","matchDateTime":"2018-08-24T20:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":3,"fullTimeAway":1},{"id":51122,"teamHomeId":7,"teamAwayId":1635,"matchDayId":1,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-08-27T04:31:37.177","matchDateTime":"2018-08-26T18:00:00","isFinished":true,"halfTimeHome":3,"halfTimeAway":1,"fullTimeHome":4,"fullTimeAway":1},{"id":51123,"teamHomeId":87,"teamAwayId":6,"matchDayId":1,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-08-26T08:11:44.773","matchDateTime":"2018-08-25T18:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":0},{"id":51124,"teamHomeId":134,"teamAwayId":55,"matchDayId":1,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-08-25T17:26:01.38","matchDateTime":"2018-08-25T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":1},{"id":51125,"teamHomeId":112,"teamAwayId":91,"matchDayId":1,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-08-25T17:27:20.913","matchDateTime":"2018-08-25T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":1,"fullTimeHome":0,"fullTimeAway":2},{"id":51126,"teamHomeId":81,"teamAwayId":16,"matchDayId":1,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-08-27T18:30:08.223","matchDateTime":"2018-08-26T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":0},{"id":51127,"teamHomeId":131,"teamAwayId":9,"matchDayId":1,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-08-25T17:26:09.207","matchDateTime":"2018-08-25T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":1},{"id":51128,"teamHomeId":185,"teamAwayId":95,"matchDayId":1,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-08-25T17:26:13.627","matchDateTime":"2018-08-25T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":2},{"id":51129,"teamHomeId":9,"teamAwayId":54,"matchDayId":2,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-02T19:57:05.037","matchDateTime":"2018-09-02T18:00:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":1,"fullTimeHome":0,"fullTimeAway":2},{"id":51130,"teamHomeId":123,"teamAwayId":112,"matchDayId":2,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-01T17:36:00.99","matchDateTime":"2018-09-01T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":1,"fullTimeHome":3,"fullTimeAway":1},{"id":51131,"teamHomeId":6,"teamAwayId":131,"matchDayId":2,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-01T17:50:36.603","matchDateTime":"2018-09-01T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":1,"fullTimeHome":1,"fullTimeAway":3},{"id":51132,"teamHomeId":1635,"teamAwayId":185,"matchDayId":2,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-02T17:23:35.8","matchDateTime":"2018-09-02T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":1},{"id":51133,"teamHomeId":16,"teamAwayId":40,"matchDayId":2,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-01T20:18:27.427","matchDateTime":"2018-09-01T18:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":1,"fullTimeHome":0,"fullTimeAway":3},{"id":51134,"teamHomeId":91,"teamAwayId":134,"matchDayId":2,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-01T17:36:41.027","matchDateTime":"2018-09-01T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":1,"fullTimeHome":1,"fullTimeAway":2},{"id":51135,"teamHomeId":95,"teamAwayId":87,"matchDayId":2,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-01T17:36:46.48","matchDateTime":"2018-09-01T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":1},{"id":51136,"teamHomeId":55,"teamAwayId":7,"matchDayId":2,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-08-31T22:28:12.717","matchDateTime":"2018-08-31T20:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":0,"fullTimeAway":0},{"id":51137,"teamHomeId":79,"teamAwayId":81,"matchDayId":2,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-01T17:36:52.107","matchDateTime":"2018-09-01T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":1,"fullTimeHome":1,"fullTimeAway":1},{"id":51138,"teamHomeId":40,"teamAwayId":6,"matchDayId":3,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-15T17:27:59.723","matchDateTime":"2018-09-15T15:30:00","isFinished":true,"halfTimeHome":2,"halfTimeAway":1,"fullTimeHome":3,"fullTimeAway":1},{"id":51139,"teamHomeId":7,"teamAwayId":91,"matchDayId":3,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-14T23:03:23.87","matchDateTime":"2018-09-14T20:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":3,"fullTimeAway":1},{"id":51140,"teamHomeId":1635,"teamAwayId":55,"matchDayId":3,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-15T17:24:47.377","matchDateTime":"2018-09-15T15:30:00","isFinished":true,"halfTimeHome":2,"halfTimeAway":1,"fullTimeHome":3,"fullTimeAway":2},{"id":51141,"teamHomeId":87,"teamAwayId":9,"matchDayId":3,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-15T20:23:06.13","matchDateTime":"2018-09-15T18:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":1},{"id":51142,"teamHomeId":134,"teamAwayId":79,"matchDayId":3,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-16T18:11:22.687","matchDateTime":"2018-09-16T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":1},{"id":51143,"teamHomeId":112,"teamAwayId":16,"matchDayId":3,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-16T19:53:33.373","matchDateTime":"2018-09-16T18:00:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":1,"fullTimeHome":3,"fullTimeAway":3},{"id":51144,"teamHomeId":81,"teamAwayId":95,"matchDayId":3,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-15T17:28:08.77","matchDateTime":"2018-09-15T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":1},{"id":51145,"teamHomeId":131,"teamAwayId":54,"matchDayId":3,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-15T17:28:06.24","matchDateTime":"2018-09-15T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":2},{"id":51146,"teamHomeId":185,"teamAwayId":123,"matchDayId":3,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-15T17:24:34.597","matchDateTime":"2018-09-15T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":1},{"id":51147,"teamHomeId":9,"teamAwayId":40,"matchDayId":4,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-22T20:22:55.45","matchDateTime":"2018-09-22T18:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":1,"fullTimeHome":0,"fullTimeAway":2},{"id":51148,"teamHomeId":123,"teamAwayId":7,"matchDayId":4,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-22T17:22:18.873","matchDateTime":"2018-09-22T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":1},{"id":51149,"teamHomeId":6,"teamAwayId":81,"matchDayId":4,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-23T17:22:32.643","matchDateTime":"2018-09-23T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":0},{"id":51150,"teamHomeId":16,"teamAwayId":185,"matchDayId":4,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-21T22:22:18.96","matchDateTime":"2018-09-21T20:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":0,"fullTimeAway":0},{"id":51151,"teamHomeId":91,"teamAwayId":1635,"matchDayId":4,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-23T19:51:35.207","matchDateTime":"2018-09-23T18:00:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":1},{"id":51152,"teamHomeId":54,"teamAwayId":87,"matchDayId":4,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-22T17:23:54.567","matchDateTime":"2018-09-22T15:30:00","isFinished":true,"halfTimeHome":2,"halfTimeAway":1,"fullTimeHome":4,"fullTimeAway":2},{"id":51153,"teamHomeId":95,"teamAwayId":134,"matchDayId":4,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-22T17:24:28.62","matchDateTime":"2018-09-22T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":2,"fullTimeHome":2,"fullTimeAway":3},{"id":51154,"teamHomeId":131,"teamAwayId":112,"matchDayId":4,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-22T17:24:34.203","matchDateTime":"2018-09-22T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":2,"fullTimeHome":1,"fullTimeAway":3},{"id":51155,"teamHomeId":79,"teamAwayId":55,"matchDayId":4,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-22T21:03:04.06","matchDateTime":"2018-09-22T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":0},{"id":51156,"teamHomeId":40,"teamAwayId":95,"matchDayId":5,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-25T22:23:08.27","matchDateTime":"2018-09-25T20:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":1},{"id":51157,"teamHomeId":7,"teamAwayId":79,"matchDayId":5,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-26T22:19:43.077","matchDateTime":"2018-09-26T20:30:00","isFinished":true,"halfTimeHome":2,"halfTimeAway":0,"fullTimeHome":7,"fullTimeAway":0},{"id":51158,"teamHomeId":1635,"teamAwayId":16,"matchDayId":5,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-26T22:22:00.29","matchDateTime":"2018-09-26T20:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":0},{"id":51159,"teamHomeId":87,"teamAwayId":91,"matchDayId":5,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-26T22:21:32.993","matchDateTime":"2018-09-26T20:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":3,"fullTimeAway":1},{"id":51160,"teamHomeId":134,"teamAwayId":54,"matchDayId":5,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-25T20:23:03.357","matchDateTime":"2018-09-25T18:30:00","isFinished":true,"halfTimeHome":2,"halfTimeAway":0,"fullTimeHome":3,"fullTimeAway":1},{"id":51161,"teamHomeId":55,"teamAwayId":123,"matchDayId":5,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-25T22:24:21.85","matchDateTime":"2018-09-25T20:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":1,"fullTimeHome":1,"fullTimeAway":3},{"id":51162,"teamHomeId":112,"teamAwayId":9,"matchDayId":5,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-25T22:23:13.507","matchDateTime":"2018-09-25T20:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":0},{"id":51163,"teamHomeId":81,"teamAwayId":131,"matchDayId":5,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-26T22:21:34.977","matchDateTime":"2018-09-26T20:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":0,"fullTimeAway":0},{"id":51164,"teamHomeId":185,"teamAwayId":6,"matchDayId":5,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-26T20:32:42.063","matchDateTime":"2018-09-26T18:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":2},{"id":51165,"teamHomeId":9,"teamAwayId":81,"matchDayId":6,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-29T17:26:26.57","matchDateTime":"2018-09-29T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":0},{"id":51166,"teamHomeId":123,"teamAwayId":1635,"matchDayId":6,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-29T17:25:28.147","matchDateTime":"2018-09-29T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":1,"fullTimeAway":2},{"id":51167,"teamHomeId":6,"teamAwayId":7,"matchDayId":6,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-29T20:23:03.447","matchDateTime":"2018-09-29T18:30:00","isFinished":true,"halfTimeHome":2,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":4},{"id":51168,"teamHomeId":16,"teamAwayId":134,"matchDayId":6,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-29T17:23:56.183","matchDateTime":"2018-09-29T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":1},{"id":51169,"teamHomeId":91,"teamAwayId":55,"matchDayId":6,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-30T17:33:05.173","matchDateTime":"2018-09-30T15:30:00","isFinished":true,"halfTimeHome":2,"halfTimeAway":0,"fullTimeHome":4,"fullTimeAway":1},{"id":51170,"teamHomeId":54,"teamAwayId":40,"matchDayId":6,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-28T22:31:08.23","matchDateTime":"2018-09-28T20:30:00","isFinished":true,"halfTimeHome":2,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":0},{"id":51171,"teamHomeId":95,"teamAwayId":112,"matchDayId":6,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-30T19:49:25.76","matchDateTime":"2018-09-30T18:00:00","isFinished":true,"halfTimeHome":2,"halfTimeAway":0,"fullTimeHome":4,"fullTimeAway":1},{"id":51172,"teamHomeId":131,"teamAwayId":87,"matchDayId":6,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-29T17:24:40.11","matchDateTime":"2018-09-29T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":1,"fullTimeHome":2,"fullTimeAway":2},{"id":51173,"teamHomeId":79,"teamAwayId":185,"matchDayId":6,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-09-29T17:22:27.45","matchDateTime":"2018-09-29T15:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":3,"fullTimeAway":0},{"id":51174,"teamHomeId":40,"teamAwayId":87,"matchDayId":7,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-10-06T21:15:37.507","matchDateTime":"2018-10-06T18:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":2,"fullTimeHome":0,"fullTimeAway":3},{"id":51175,"teamHomeId":123,"teamAwayId":91,"matchDayId":7,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-10-07T17:25:54.37","matchDateTime":"2018-10-07T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":1,"fullTimeHome":1,"fullTimeAway":2},{"id":51176,"teamHomeId":7,"teamAwayId":95,"matchDayId":7,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-10-06T17:24:45.753","matchDateTime":"2018-10-06T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":1,"fullTimeHome":4,"fullTimeAway":3},{"id":51177,"teamHomeId":1635,"teamAwayId":79,"matchDayId":7,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-10-07T19:51:01.097","matchDateTime":"2018-10-07T18:00:00","isFinished":true,"halfTimeHome":4,"halfTimeAway":0,"fullTimeHome":6,"fullTimeAway":0},{"id":51178,"teamHomeId":134,"teamAwayId":131,"matchDayId":7,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-10-06T08:42:31.8","matchDateTime":"2018-10-05T20:30:00","isFinished":true,"halfTimeHome":1,"halfTimeAway":0,"fullTimeHome":2,"fullTimeAway":0},{"id":51179,"teamHomeId":55,"teamAwayId":16,"matchDayId":7,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-10-17T15:04:40.81","matchDateTime":"2018-10-06T15:30:00","isFinished":true,"halfTimeHome":2,"halfTimeAway":0,"fullTimeHome":3,"fullTimeAway":1},{"id":51180,"teamHomeId":112,"teamAwayId":6,"matchDayId":7,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-10-07T15:21:40.593","matchDateTime":"2018-10-07T13:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":0,"fullTimeAway":0},{"id":51181,"teamHomeId":81,"teamAwayId":54,"matchDayId":7,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-10-06T17:22:27.98","matchDateTime":"2018-10-06T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":0,"fullTimeAway":0},{"id":51182,"teamHomeId":185,"teamAwayId":9,"matchDayId":7,"league":"bl1","leagueKey":4276,"year":2018,"lastUpdate":"2018-10-07T17:13:44.237","matchDateTime":"2018-10-06T15:30:00","isFinished":true,"halfTimeHome":0,"halfTimeAway":0,"fullTimeHome":0,"fullTimeAway":2}]

// @ts-ignore
test('aggregateSeasonInfo on empty', () => {
    const stats = aggregateSeasonInfo([])
    // @ts-ignore
    expect(stats.length).toEqual(0)
  })

// @ts-ignore
test('aggregateSeasonInfo on one match', () => {
    const stats = aggregateSeasonInfo([{"teamHomeId":185,"teamAwayId":9,"fullTimeHome":0,"fullTimeAway":2}])
    // @ts-ignore
    expect(stats.length).toEqual(2)

    const homeStats = stats[0]
    expect(homeStats.team).toEqual(185)
    expect(homeStats.hgf).toEqual(0)
    expect(homeStats.hga).toEqual(2)
    expect(homeStats.hp).toEqual(0)
    expect(homeStats.hm).toEqual(1)
    expect(homeStats.agf).toEqual(0)
    expect(homeStats.aga).toEqual(0)
    expect(homeStats.ap).toEqual(0)
    expect(homeStats.am).toEqual(0)
    expect(homeStats.tgf).toEqual(0)
    expect(homeStats.tga).toEqual(2)
    expect(homeStats.tp).toEqual(0)
    expect(homeStats.tm).toEqual(1)

    const awayStats = stats[1]
    expect(awayStats.team).toEqual(9)
    expect(awayStats.hgf).toEqual(0)
    expect(awayStats.hga).toEqual(0)
    expect(awayStats.hp).toEqual(0)
    expect(awayStats.hm).toEqual(0)
    expect(awayStats.agf).toEqual(2)
    expect(awayStats.aga).toEqual(0)
    expect(awayStats.ap).toEqual(3)
    expect(awayStats.am).toEqual(1)
    expect(awayStats.tgf).toEqual(2)
    expect(awayStats.tga).toEqual(0)
    expect(awayStats.tp).toEqual(3)
    expect(awayStats.tm).toEqual(1)
  })

  // @ts-ignore
test('aggregateSeasonInfo - check home defense factor', () => {
    const stats = aggregateSeasonInfo(
        [
            {"teamHomeId":1,"teamAwayId":2,"fullTimeHome":2,"fullTimeAway":0},
            {"teamHomeId":1,"teamAwayId":3,"fullTimeHome":2,"fullTimeAway":1},
            {"teamHomeId":2,"teamAwayId":3,"fullTimeHome":2,"fullTimeAway":1},
            {"teamHomeId":2,"teamAwayId":1,"fullTimeHome":2,"fullTimeAway":1},
            {"teamHomeId":3,"teamAwayId":1,"fullTimeHome":2,"fullTimeAway":1},
            {"teamHomeId":3,"teamAwayId":2,"fullTimeHome":2,"fullTimeAway":2},
        ])
    // @ts-ignore
    expect(stats.length).toEqual(3)
    const stats1 = stats.find(x=>x.team===1)
    const stats2 = stats.find(x=>x.team===2)
    const stats3 = stats.find(x=>x.team===3)
    expect(stats1.hdf).toEqual(0.5)
    expect(stats1.hga).toEqual(1)
    expect(stats2.hdf).toEqual(1.0)
    expect(stats2.hga).toEqual(2)
    expect(stats3.hdf).toEqual(1.5)
    expect(stats3.hga).toEqual(3)
  })

  // @ts-ignore
  test('aggregateSeasonInfo - check away defense factor', () => {
    const stats = aggregateSeasonInfo(
        [
            {"teamHomeId":1,"teamAwayId":2,"fullTimeHome":2,"fullTimeAway":1},
            {"teamHomeId":1,"teamAwayId":3,"fullTimeHome":2,"fullTimeAway":1},
            {"teamHomeId":2,"teamAwayId":3,"fullTimeHome":3,"fullTimeAway":1},
            {"teamHomeId":2,"teamAwayId":1,"fullTimeHome":1,"fullTimeAway":1},
            {"teamHomeId":3,"teamAwayId":1,"fullTimeHome":2,"fullTimeAway":1},
            {"teamHomeId":3,"teamAwayId":2,"fullTimeHome":2,"fullTimeAway":1},
        ])
    // @ts-ignore
    expect(stats.length).toEqual(3)
    const stats1 = stats.find(x=>x.team===1)
    const stats2 = stats.find(x=>x.team===2)
    const stats3 = stats.find(x=>x.team===3)
    expect(stats1.adf).toEqual(0.75)
    expect(stats1.aga).toEqual(3)
    expect(stats2.adf).toEqual(1.0)
    expect(stats2.aga).toEqual(4)
    expect(stats3.adf).toEqual(1.25)
    expect(stats3.aga).toEqual(5)
  })

    // @ts-ignore
    test('aggregateSeasonInfo - check total defense factor', () => {
        const stats = aggregateSeasonInfo(
            [
                {"teamHomeId":1,"teamAwayId":2,"fullTimeHome":2,"fullTimeAway":0},
                {"teamHomeId":1,"teamAwayId":3,"fullTimeHome":2,"fullTimeAway":1},
                {"teamHomeId":2,"teamAwayId":3,"fullTimeHome":3,"fullTimeAway":1},
                {"teamHomeId":2,"teamAwayId":1,"fullTimeHome":1,"fullTimeAway":1},
                {"teamHomeId":3,"teamAwayId":1,"fullTimeHome":2,"fullTimeAway":1},
                {"teamHomeId":3,"teamAwayId":2,"fullTimeHome":2,"fullTimeAway":2},
            ])
        // @ts-ignore
        expect(stats.length).toEqual(3)
        const stats1 = stats.find(x=>x.team===1)
        const stats2 = stats.find(x=>x.team===2)
        const stats3 = stats.find(x=>x.team===3)
        expect(stats1.tdf).toEqual(4.0/6.0)
        expect(stats1.tga).toEqual(4)
        expect(stats2.tdf).toEqual(1.0)
        expect(stats2.tga).toEqual(6)
        expect(stats3.tdf).toEqual(8.0/6.0)
        expect(stats3.tga).toEqual(8)
      })


// @ts-ignore
test('aggregateSeasonInfo results in 18 values', () => {
    const stats = aggregateSeasonInfo(matchs)
    // @ts-ignore
    expect(stats.length).toEqual(18)
  })

  // @ts-ignore
test('aggregateSeasonInfo results in symmetric sums for all goals', () => {
    const stats = aggregateSeasonInfo(matchs)
    //console.log(stats[0])
    const sum = stats.reduce((res,x)=>{
        var aggregate = { ...res };
        aggregate.thgf += x.hgf;
        aggregate.thga += x.hga;
        aggregate.thm += x.hm;
        aggregate.tagf += x.agf;
        aggregate.taga += x.aga;
        aggregate.tam += x.am;
        aggregate.ttgf += x.tgf;
        aggregate.ttga += x.tga;
        aggregate.ttm += x.tm;
        return aggregate;
    }, {thgf:0, thga:0, thm:0, tagf:0, taga:0, tam:0, ttgf:0, ttga:0, ttm:0})
    // @ts-ignore
    expect(sum.thgf).toEqual(112)
    expect(sum.thga).toEqual(77)
    expect(sum.tagf).toEqual(77)
    expect(sum.taga).toEqual(112)
    expect(sum.ttgf).toEqual(189)
    expect(sum.ttga).toEqual(189)
    expect(sum.thm).toEqual(63)
    expect(sum.tam).toEqual(63)
    expect(sum.ttm).toEqual(126)

  })