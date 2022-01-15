import { doc, deleteDoc, getFirestore } from 'firebase/firestore'

export default function deleteData(collectionName, id) {
  const db = getFirestore()
  return deleteDoc(doc(db, collectionName, id));
}