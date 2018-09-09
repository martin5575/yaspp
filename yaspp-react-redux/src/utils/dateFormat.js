import moment from 'moment'

export function formatUpdateDate(lastUpdate) {
  const lastUpdateDate = moment(lastUpdate)
  const now = moment()
  var dt = moment.duration(lastUpdateDate.diff(now))

  return dt.asYears() > -1
    ? dt.humanize(true)
    : lastUpdateDate.format('DD.MM.YY HH:mm')
}
