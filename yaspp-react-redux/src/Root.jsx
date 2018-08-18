import * as React from 'react'
import { Component } from 'react'
import App from './parts/App'
import Header from './parts/Header'
import Footer from './parts/Footer'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'

library.add(icons.faSync)
// library.add(icons.faBars)
// library.add(icons.faSlidersH)

class Root extends Component {
  render() {
    const store = this.props.store
    return (
      <div>
        <Header store={store} />
        <App store={store} />
        <Footer />
      </div>
    )
  }
}
export default Root
