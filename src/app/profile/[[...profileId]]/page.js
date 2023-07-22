"use client"

import { useParams } from 'next/navigation'

const Profile = () => {
    const { profileId } = useParams()
  return (
    <div>Profile ID: {profileId}</div>
  )
}

export default Profile;
