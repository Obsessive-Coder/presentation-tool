import { useState } from 'react'

// Components.
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
// import { FirebaseAuth } from './components/auth'
import { Authentication, Home } from './pages'
import { Route1, Route2 } from './routes'

// Styles, utils, and other helpers.
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from './utils/firebase/admin'

function App() {
  const navigate = useNavigate()
  const [user, setUser] = useState({})

  onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
    setUser(currentUser)
  })

  const logoutUser = async () => {
    await signOut(FIREBASE_AUTH)
    navigate('/')
  }


  return (
    <div>
      <header>
        <h1>Presentation Tool</h1>

        <nav>
          <Link to="/route1">Route 1</Link>{' '}
          <Link to="/route2">Route 2</Link>
          <button onClick={logoutUser}>Logout</button>
        </nav>
      </header>

      <Routes>
        {user?.email ? (
          <>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/route1" element={<Route1 />} />
            <Route exact path="/route2" element={<Route2 />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<Authentication />} />
          </>
        )}

      </Routes>
    </div>
  );
}

export default App;
