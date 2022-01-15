import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'

export default function readData(collectionName, field = '', value = '') {
  const db = getFirestore()
  const collectRef = collection(db, collectionName)

  let dbQuery = query(collectRef)

  if (field && value) {
    dbQuery = query(collectRef, where(field, '==', value))
  }

  return getDocs(dbQuery)
}