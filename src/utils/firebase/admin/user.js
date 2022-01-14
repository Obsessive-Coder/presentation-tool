import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { getAuth, signOut, onIdTokenChanged, } from 'firebase/auth'


import initializeFirebase from './initialize'

import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from './userCookies'
import { mapUserData } from './mapUserData'

initializeFirebase()

const useUser = () => {
  const [user, setUser] = useState()
  const router = useRouter()
  const auth = getAuth()

  const logout = async () => {
    return signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push('/')
      })
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date)
    const cancelAuthListener = onIdTokenChanged(auth, (user) => {
      if (user) {
        const userData = mapUserData(user)
        setUserCookie(userData)
        setUser(userData)
      } else {
        removeUserCookie()
        setUser({})
      }
    })

    const userFromCookie = getUserFromCookie()

    if (!userFromCookie) {
      router.push('/')
      return
    }

    setUser(userFromCookie)

    return () => {
      cancelAuthListener()
    }
  }, [])

  return { user, logout }
}

export default useUser