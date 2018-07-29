import * as React from 'react'
import { Component } from 'react'
import App from './App'
import Header from './Header'
import Footer from './Footer'

class Root extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const store = this.props.store
    return (
      <div>
        <Header />
        <App store={store} />
        <Footer />
      </div>
    )
  }
}
export default Root
