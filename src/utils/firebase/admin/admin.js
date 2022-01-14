import { initializeApp } from 'firebase-admin/app'

export const verifyIdToken = (token) => {
  const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY

  // if (!admin.apps.length) {
  initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.REACT_APP_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // https://stackoverflow.com/a/41044630/1332513
      privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.REACT_APP_PUBLIC_FIREBASE_DATABASE_URL,
  })
  // }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((error) => {
      throw error
    })
}