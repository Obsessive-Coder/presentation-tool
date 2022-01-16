import React from 'react'

// Components.
import { Navbar } from '../components'

export default function Help({ isUserAuthenticated, handleDrawerToggle }) {
  return (
    <main>
      <Navbar isUserAuthenticated={isUserAuthenticated} handleDrawerToggle={handleDrawerToggle} />
      Help Page
    </main>
  )
}
