import * as React from 'react'
import { connect } from 'react-redux'
import './Footer.css'
import { getSelectedMatchs, getLatestUpdate } from '../utils/filter'
import { formatUpdateDate } from '../utils/dateFormat'

const mapStateToProps = (state) => ({
  lastUpdate: getLatestUpdate(getSelectedMatchs(state)),
})

const commitSha = process.env.REACT_APP_COMMIT_SHA
const buildDate = process.env.REACT_APP_BUILD_DATE

const AboutInfo = () => {
  if (!commitSha && !buildDate) return null
  const shortSha = commitSha ? commitSha.slice(0, 7) : null
  const formattedDate = buildDate
    ? new Date(buildDate).toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
    : null
  return (
    <div className="col text-center">
      <small className="text-muted">
        {shortSha && (
          <>
            build{' '}
            <a
              href={`https://github.com/martin5575/yaspp/commit/${commitSha}`}
              target="_blank"
              rel="noreferrer"
            >
              {shortSha}
            </a>
          </>
        )}
        {shortSha && formattedDate && ' · '}
        {formattedDate}
      </small>
    </div>
  )
}

const FooterTemplate = ({ lastUpdate }) => (
  <footer>
    <hr />
    <div className="row">
      <div className="col self-align-start">
        <small>
          <i>aktualisiert</i> {formatUpdateDate(lastUpdate)}
        </small>
      </div>
      <AboutInfo />
      <div className="col self-align-end text-right">
        <small>
          <i>
            powered by <a href="https://www.openligadb.de">Openliga DB</a>
          </i>
        </small>
      </div>
    </div>
  </footer>
)

const Footer = connect(mapStateToProps)(FooterTemplate)
export default Footer
