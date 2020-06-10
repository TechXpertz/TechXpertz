import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-spa";

const ExternalApi = url => {
    const [apiMessage, setApiMessage] = useState("");
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

            setApiMessage(responseData);
        } catch (error) {
            console.error(error);
        }
    };

    return apiMessage;
};

export default ExternalApi;