export const mapUserData = (user) => {
  const { uid, email, xa: token, displayName, photoUrl } = user

  return {
    id: uid,
    name: displayName,
    profilePic: photoUrl,
    email,
    token,
  }
}