import React, { useState } from 'react';
import { Redirect } from "react-router-dom";
import { useAuth0 } from "../react-auth0-spa";
import { register } from '../api_callers/apis.json';
import LoaderPage from './LoaderPage';
import NavBar from './NavBar';

const Callback = () => {

    const { isAuthenticated, loading, getTokenSilently } = useAuth0();
    const registerStatus = [];
    const [loader, setLoader] = useState(true);

    React.useEffect(() => {
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
        if (!loading) {
            callApi().then(res => {
                console.log('status', res);
                registerStatus.push(res);
                setLoader(false);
            });;
        }
    }, [loading, registerStatus]);

    if (loading || loader) {
        return (<>
            <NavBar />
            <LoaderPage />
        </>
        );
    } else if (isAuthenticated) {
        return (<Redirect to="/dashboard" />);
    } else {
        return (<Redirect to="/" />);
    }
}

export default Callback;