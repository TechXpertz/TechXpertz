import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";
import { register } from "../api_callers/apis.json";


const Callback = () => {
    const { getTokenSilently } = useAuth0();

    const callApi = async () => {
        try {
            const token = await getTokenSilently();

            const response = await fetch(register, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                method: 'POST'
            });

            const responseData = await response.json();
            return responseData;

        } catch (error) {
            console.error(error);
        }
    };

    const { isAuthenticated, loading } = useAuth0();

    if (loading) {
        return (<p>Loading...</p>);
    } else if (isAuthenticated) {
        console.log(JSON.stringify(callApi()));
        return (<Redirect to="/dashboard" />);
    } else {
        return (<Redirect to="/" />);
    }
}

export default Callback;