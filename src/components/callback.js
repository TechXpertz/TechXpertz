import React from 'react';
import { Redirect } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";

const Callback = () => {

    const { isAuthenticated, loading, user } = useAuth0();
    if (loading) {
        return (<p>Loading...</p>);
    } else if (isAuthenticated) {
        return (<Redirect to="/dashboard" />);
    } else {
        return (<Redirect to="/" />);
    }
}

export default Callback;