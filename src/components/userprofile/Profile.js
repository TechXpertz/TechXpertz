import React from 'react';
import UserNavBar from '../dashboard/UserNavBar';
import ProfileContent from './ProfileContent';

const Profile = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <UserNavBar selected={{ about: false, FAQ: false, profile: true }} />
      <ProfileContent />
    </div>
  );
};

export default Profile;
