import React from 'react'
import moment from 'moment'
import Match from './Match'
import './MatchsPerDay.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class MatchsPerDay extends React.Component {
  render() {
    const statsTitle = this.props.statsTitle
    const statsDescription = this.props.statsDescription
    const showPercentage = this.props.showPercentage
    return (
      < >
              <div className="row" key="this.props.date">
                <div scope="col" className="col-5">
                  <small>
                    {moment(this.props.date).format('ddd DD.MM HH:mm')}
                  </small>
                </div>
                {statsTitle && (
                  <div scope="col" className="col-2 text-center p-0">
                    <small>
                      {statsTitle}
                      &nbsp;
                      <FontAwesomeIcon icon="info-circle" size="sm" />
                    </small>
                  </div>
                )}
                {statsTitle && (
                  <div scope="col" className="col-1 text-center p-0">
                    <small>1</small>
                  </div>
                )}
                {statsTitle && (
                  <div scope="col" className="col-1 text-center p-0">
                    <small>0</small>
                  </div>
                )}
                {statsTitle && (
                  <div scope="col" className="col-1 text-center p-0">
                    <small>2</small>
                  </div>
                )}
                {statsTitle && (
                  <div scope="col" className="col-1 text-center p-0" />
                )}
              </div>
              {this.props.matchs.map((m) => (
                <Match
                  match={m}
                  teams={this.props.teams}
                  seasonInfo={this.props.seasonInfo}
                  key={m.id}
                  showPercentage={showPercentage}
                  selectedModelId={this.props.selectedModelId}
                  probabilityDetailsMatchId={this.props.probabilityDetailsMatchId}
                  toggleProbabilityDetails={this.props.toggleProbabilityDetails}
                />
              ))}
        </>
    )
  }
}

export default MatchsPerDay
