import { useState } from 'react'

// Components.
import { Link, Route, Routes } from 'react-router-dom'
// import { FirebaseAuth } from './components/auth'
import { Home } from './pages'
import { Route1, Route2 } from './routes'

// Styles, utils, and other helpers.
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from './utils/firebase/config'

const defaultRegisterData = { email: '', password: '' }
const defaultLoginData = { ...defaultRegisterData }

function App() {
  const [registerData, setRegisterData] = useState({ ...defaultRegisterData })
  const [loginData, setLoginData] = useState({ ...defaultLoginData })
  const [user, setUser] = useState({})

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
  })

  const registerUser = async () => {
    try {
      const { email, password } = registerData
      await createUserWithEmailAndPassword(auth, email.toLowerCase().trim(), password.trim())
    } catch (error) {
      console.log(error.message)
    }
  }

  const loginUser = async () => {
    try {
      const { email, password } = loginData
      await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), password.trim())
    } catch (error) {
      console.log(error.message)
    }
  }

  const logoutUser = async () => {
    await signOut(auth)
  }

  const handleInputOnChange = (event, type, field) => {
    const { value } = event.target
    const isRegister = type === 'register'
    const setMethod = isRegister ? setRegisterData : setLoginData
    const data = isRegister ? registerData : loginData
    setMethod({
      ...data,
      [field]: value
    })
  }

  const { email: registerEmail, password: registerPassword } = registerData
  const { email: loginEmail, password: loginPassword } = loginData

  return (
    <div>
      <header>
        <h1>Presentation Tool</h1>

        {/* <FirebaseAuth /> */}

        <nav>
          {/* <Link to="/route1">Route 1</Link>{' '}
          <Link to="/route2">Route 2</Link> */}
        </nav>
      </header>

      <div>
        <h3>Register</h3>
        <input placeholder="Email" onChange={(event) => handleInputOnChange(event, 'register', 'email')} />
        <input type="password" placeholder="Password" onChange={(event) => handleInputOnChange(event, 'register', 'password')} />
        <button onClick={registerUser}>Register</button>
      </div>

      <div>
        <h3>Log In</h3>
        <input placeholder="Email" onChange={(event) => handleInputOnChange(event, 'login', 'email')} />
        <input type="password" placeholder="Password" onChange={(event) => handleInputOnChange(event, 'login', 'password')} />
        <button onClick={loginUser}>Log In</button>
      </div>

      <div>
        <h4>User Logged In: </h4>
        {user?.email}
      </div>

      <br />
      <button onClick={logoutUser}>Log Out</button>
    </div>
  );
}

export default App;
