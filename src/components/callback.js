import React from 'react';
import { Redirect } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";
import BackendApi from "../api_callers/backend_api";
import { register } from "../api_callers/apis.json";

const Callback = () => {

    const { isAuthenticated, loading } = useAuth0();
    if (loading) {
        return (<p>Loading...</p>);
    } else if (isAuthenticated) {

        const response = BackendApi(register)();
        console.log(response);

        return (<Redirect to="/dashboard" />);
    } else {
        return (<Redirect to="/" />);
    }
}

export default Callback;