import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-spa";

const BackendApi = url => {
    const { getTokenSilently } = useAuth0();

    const callApi = async () => {
        try {
            const token = await getTokenSilently();

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const responseData = await response.json();
            return responseData;

        } catch (error) {
            console.error(error);
        }
    };

    return callApi;
};

export default BackendApi;