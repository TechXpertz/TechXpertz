import React, { Fragment } from "react";
import { useAuth0 } from "../../react-auth0-spa";

const Profile = () => {
  const { loading, user, logout, isAuthenticated } = useAuth0();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <img src={user.picture} alt="Profile" />
      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}

      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <code>{JSON.stringify(user, null, 2)}</code>
    </Fragment>
  );
};

export default Profile;