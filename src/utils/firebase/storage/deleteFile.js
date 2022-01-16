import { getStorage, ref, deleteObject } from 'firebase/storage'

export default function deleteFile(fileName) {
  const storage = getStorage()
  const storageRef = ref(storage, `slides/${fileName}`)
  return deleteObject(storageRef)
}