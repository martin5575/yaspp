import React from 'react'
import moment from 'moment'
import './index.css'
import './Matchs.css'

class Matchs extends React.Component {
  constructor(props) {
    super(props)
  }
  logoSize = 20
  render() {
    const matchs = this.props.matchs
    const teams = this.props.teams
    if (!matchs || matchs.length == 0 || !teams) return <div>empty</div>

    return (
      <div>
        <span className="label label-default align-left">
          {moment(matchs[0].matchDateTime).format('dddd DD.MM.YY')}
        </span>
        <table className="table">
          <tbody>
            {matchs.map((m) => (
              <tr
                className="row"
                key={m.id}
                data-toggle="tooltip"
                title={
                  'aktualisiert: ' +
                  moment(m.lastUpdate).format('DD.MM.YY HH:mm:ss')
                }
              >
                <td className="col-xs-1">
                  {moment(m.matchDateTime).format('HH:mm')}
                </td>
                <td className="col-xs-1">
                  <img
                    src={teams[m.teamHomeId].iconUrl}
                    alt={teams[m.teamHomeId].shortName}
                    height={this.logoSize}
                    width={this.logoSize}
                  />
                </td>
                <td className="col-xs-1">:</td>
                <td className="col-xs-1">
                  <img
                    src={teams[m.teamAwayId].iconUrl}
                    alt={teams[m.teamAwayId].shortName}
                    height={this.logoSize}
                    width={this.logoSize}
                  />
                </td>
                <td className="col-xs-1">
                  ({m.halfTimeHome}:{m.halfTimeAway})
                </td>
                <td className={'col-xs-1 ' + (m.isFinished ? 'final' : '')}>
                  {m.fullTimeHome}:{m.fullTimeAway}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Matchs
