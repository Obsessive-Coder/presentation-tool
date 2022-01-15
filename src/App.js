import { useState } from 'react'

// Components.
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { Authentication, Help, Home, Presentations, Slides } from './pages'
import { Navbar, NavDrawer } from './components'

// Styles, utils, and other helpers.
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from './utils/firebase/admin'

function App() {
  const navigate = useNavigate()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [user, setUser] = useState({})

  onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
    setUser(currentUser)
  })

  const logoutUser = async () => {
    await signOut(FIREBASE_AUTH)
    navigate('/')
  }

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const isUserAuthenticated = user?.email !== null && user?.email !== undefined

  return (
    <div>
      <Navbar isUserAuthenticated={isUserAuthenticated} handleDrawerToggle={handleDrawerToggle}>
      </Navbar>

      <Box display="flex">
        {isUserAuthenticated && (
          <NavDrawer
            isOpen={isDrawerOpen}
            handleDrawerToggle={handleDrawerToggle}
            handleLogout={logoutUser}
          />
        )}

        <Box flexGrow={1} mt={6} px={3} pt={5} pb={40}>
          <Routes>
            {isUserAuthenticated ? (
              <>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/presentations" element={<Presentations />} />
                <Route exact path="/slides" element={<Slides />} />
                <Route exact path="/help" element={<Help />} />
              </>
            ) : (
              <>
                <Route path="/*" element={<Authentication />} />
              </>
            )}

          </Routes>
        </Box>
      </Box>
    </div>
  );
}

export default App;
