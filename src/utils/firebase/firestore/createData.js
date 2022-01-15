import { collection, getFirestore, addDoc } from 'firebase/firestore'

export default function createData(collectionName, data) {
  const db = getFirestore()
  const collectionRef = collection(db, collectionName)
  return addDoc(collectionRef, data)
}