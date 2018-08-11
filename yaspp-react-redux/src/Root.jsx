import * as React from 'react'
import { Component } from 'react'
import App from './parts/App'
import Header from './parts/Header'
import Footer from './parts/Footer'

class Root extends Component {
  constructor(props) {
    super(props)
  }

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
