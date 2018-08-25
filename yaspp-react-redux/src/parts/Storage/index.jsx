import * as React from 'react'
import { ClearAllButton } from './ClearAllButton'
import { ClearTeams } from './ClearTeams'

export default class Storage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const ClearTeams1 = ClearTeams('bl1')
    return (
      <div>
        <h3>
          Lokaler Speicher <ClearAllButton />
        </h3>
        <table>
          <thead />
          <tbody>
            <tr>
              <td>
                Teams <ClearTeams1 />{' '}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
