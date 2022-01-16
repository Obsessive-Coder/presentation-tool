import { getStorage, ref, uploadBytes } from 'firebase/storage'

export default function uploadFile(file) {
  const storage = getStorage()
  const storageRef = ref(storage, `slides/${file.name}`)
  return uploadBytes(storageRef, file)
}