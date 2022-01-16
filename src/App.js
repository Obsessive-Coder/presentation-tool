import { useState } from 'react'

// Components.
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { Authentication, Help, Home, Presentations, Slides } from './pages'
import { NavDrawer } from './components'

// Styles, utils, and other helpers.
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from './utils/firebase/admin'

const routes = [{
  path: '/',
  Component: Home,
}, {
  path: '/presentations',
  Component: Presentations,
}, {
  path: '/slides',
  Component: Slides,
}, {
  path: '/help',
  Component: Help,
}]

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
                {routes.map(({ path, Component }) => (
                  <Route
                    exact
                    key={`page-route-${path}`}
                    path={path}
                    element={(
                      <Component isUserAuthenticated={isUserAuthenticated} handleDrawerToggle={handleDrawerToggle} />
                    )}
                  />
                ))}
                {/* <Route exact path="/" element={<Home />} />
                <Route exact path="/presentations" element={<Presentations />} />
                <Route exact path="/slides" element={<Slides isUserAuthenticated={isUserAuthenticated} handleDrawerToggle={handleDrawerToggle} />} />
                <Route exact path="/help" element={<Help />} /> */}
              </>
            ) : (
              <>
                <Route
                  path="/*"
                  element={(
                    <Authentication
                      isUserAuthenticated={isUserAuthenticated}
                      handleDrawerToggle={handleDrawerToggle}
                    />
                  )}
                />
              </>
            )}

          </Routes>
        </Box>
      </Box>
    </div>
  );
}

export default App;
