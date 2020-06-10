import React from 'react';
import { useAuth0 } from '../../react-auth0-spa';

const UserDashboard = () => {
    const { isAuthenticated, logout } = useAuth0();
    return(
        <div>
            DashBoard
            {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
        </div>
    );
}

export default UserDashboard;