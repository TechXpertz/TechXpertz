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

// console.log(user);
// if (loading || !user) {
//   return <div>Loading...</div>;
// }

// return (
//   <>
//     <img src={user.picture} alt='Profile' />
//     {isAuthenticated && <button onClick={() => logout()}>Log out</button>}

//     <h2>{user.name}</h2>
//     <p>{user.email}</p>
//     <code>{JSON.stringify(user, null, 2)}</code>
//   </>
// );
