import { useState } from 'react'

// Components.

// Styles, utils, and other helpers.
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '../utils/firebase/admin'

const defaultFormData = { email: '', password: '' }

export default function Authentication() {
  const [formData, setFormData] = useState({ ...defaultFormData })
  const [authView, setAuthView] = useState('login')
  const isLoginView = authView === 'login'

  const handleSubmitCredentials = async () => {
    try {
      const { email, password } = formData
      const isLoginView = authView === 'login'
      const authMethod = isLoginView ? signInWithEmailAndPassword : createUserWithEmailAndPassword
      await authMethod(FIREBASE_AUTH, email.toLowerCase().trim(), password.trim())
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleInputOnChange = (event, field) => {
    const { value } = event.target

    setFormData({
      ...formData,
      [field]: value
    })
  }

  return (
    <div>
      <div>
        <h3 style={{ textTransform: 'capitalize' }}>{authView}</h3>

        <input
          placeholder="Email"
          onChange={(event) => handleInputOnChange(event, 'email')}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(event) => handleInputOnChange(event, 'password')}
        />

        <button
          onClick={handleSubmitCredentials}
          style={{ textTransform: 'capitalize' }}
        >
          {authView}
        </button>

        <br />

        <button onClick={() => setAuthView(isLoginView ? 'register' : 'login')}>
          {isLoginView ? 'Sign up if you don\'t have an account' : 'Login if you already have an account'}
        </button>
      </div>
    </div>
  )
}
