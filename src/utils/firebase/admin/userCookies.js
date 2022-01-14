import cookies from 'js-cookie'

export const getUserFromCookie = () => {
  const cookie = cookies.get('auth')
  if (!cookie) return
  return JSON.parse(JSON.stringify(cookie))
}

export const setUserCookie = user => {
  cookies.set('auth', user, {
    // Set cookie expiry to match Firebase id tokens expiry (1 hour).
    expires: 1 / 24
  })
}

export const removeUserCookie = () => cookies.remove('auth')