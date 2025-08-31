import * as React from 'react'
import MainNavbar from '../components/MainNavbar'
import './Header.css'
import { Badge } from 'reactstrap'

function Header({ store }) {
  return (
    <header>
      <p className="text-center font-italic">
        <Badge color="dark">yaspp</Badge>
        &nbsp; yet another sports page
      </p>
      <MainNavbar store={store} />
    </header>
  )
}
export default Header
