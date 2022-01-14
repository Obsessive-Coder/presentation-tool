import { initializeApp } from 'firebase/app'

// Firebase modules.
import { getAnalytics } from 'firebase/analytics'
import { getPerformance } from 'firebase/performance'

const credentials = {
  apiKey: process.env.REACT_APP_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_PUBLIC_FIREBASE_APP_ID,
}



function initFirebase() {
  const firebaseApp = initializeApp(credentials)

  // Check that 'window' is in scope for the analytics module.
  if (typeof window !== 'undefined') {
    // Enable analytics.
    if ('measurementId' in credentials) {
      getAnalytics(firebaseApp)
      getPerformance(firebaseApp)
    }
  }

  console.log('Firebase was successfully initialized.')
  return firebaseApp
}

export default initFirebase