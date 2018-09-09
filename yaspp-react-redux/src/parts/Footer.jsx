import * as React from 'react'
import { connect } from 'react-redux'
import './Footer.css'
import { getSelectedMatchs, getLatestUpdate } from '../utils/filter'
import { formatUpdateDate } from '../utils/dateFormat'

const mapStateToProps = (state) => ({
  lastUpdate: getLatestUpdate(getSelectedMatchs(state)),
})

const FooterTemplate = ({ lastUpdate }) => (
  <footer>
    <hr />
    <div className="row">
      <div className="col self-align-start">
        <small>
          <i>update</i> {formatUpdateDate(lastUpdate)}
        </small>
      </div>
      <div className="col self-align-end text-right">
        <small>
          <i
          // style={{
          //   margin: '20px',
          // }}
          >
            powered by <a href="https://www.openligadb.de">Openliga DB</a>
          </i>
        </small>
      </div>
    </div>
  </footer>
)

const Footer = connect(mapStateToProps)(FooterTemplate)
export default Footer
