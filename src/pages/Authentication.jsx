import { useState } from 'react'

// Components.
import { Box, Button, TextField } from '@mui/material'
import { Navbar } from '../components'

// Styles, utils, and other helpers.
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { FIREBASE_AUTH } from '../utils/firebase/admin'

const defaultFormData = { email: '', password: '' }

export default function Authentication({ isUserAuthenticated, handleDrawerToggle }) {
  const [formData, setFormData] = useState({ ...defaultFormData })
  const [authView, setAuthView] = useState('login')

  // NOTE: Commented out to disable registration.
  // const isLoginView = authView === 'login'

  const handleSubmitCredentials = async (event) => {
    event.preventDefault()

    try {
      const { email, password } = formData

      // NOTE: Commented out to disable registration.
      // const isLoginView = authView === 'login'

      // NOTE: Commented out to disable registration.
      // const authMethod = isLoginView ? signInWithEmailAndPassword : createUserWithEmailAndPassword
      await signInWithEmailAndPassword(FIREBASE_AUTH, email.toLowerCase().trim(), password.trim())
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
    <main>
      <Navbar isUserAuthenticated={isUserAuthenticated} handleDrawerToggle={handleDrawerToggle} />

      <Box
        component="form"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        onSubmit={handleSubmitCredentials}
        sx={{ textAlign: 'center', width: '25%', margin: 'auto', pb: '2rem', px: '2rem', border: 'thin solid #542989', borderRadius: 3 }}
      >
        <h2 style={{ textTransform: 'capitalize', color: '#542989' }}>{authView}</h2>

        <TextField
          required
          label="Email"
          placeholder="example@email.com"
          onChange={(event) => handleInputOnChange(event, 'email')}
          sx={{ my: '1rem' }}
        />

        <TextField
          required
          type="password"
          label="Password"
          helperText="Must be at least 6 characters long"
          FormHelperTextProps={{ style: { fontWeight: 'bold' } }}
          onChange={(event) => handleInputOnChange(event, 'password')}
          sx={{ my: '1rem' }}
        />

        <Box display="flex" justifyContent="end" alignItems="center">
          {/* NOTE: Commented out to disable registration. */}

          {/* <Button type="button" color="info" onClick={() => setAuthView(isLoginView ? 'register' : 'login')}>
            {isLoginView ? 'Register for a new account' : 'Login to an existing account'}
          </Button> */}

          <Button
            type="submit"
            variant="contained"
            style={{ textTransform: 'capitalize' }}
          >
            {authView}
          </Button>
        </Box>
      </Box>
    </main>
  )
}
