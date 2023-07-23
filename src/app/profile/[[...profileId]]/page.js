"use client"

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const Profile = () => {
  const { profileId } = useParams()

  useEffect(() => {
    async function getProfile() {
      return null;
    }
    const profile = getProfile();
  }, []);

  return (
    <div>Profile ID: {profileId}</div>
  )
}

export default Profile;
