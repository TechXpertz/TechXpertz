import React, { useState } from 'react';
import UserNavBar from './UserNavBar';
import NormalForm from './NormalForm';
import ExpertForm from './ExpertForm';
import TypeCheckForm from './TypeCheckForm';
import Axios from 'axios';
import { useAuth0 } from "../../react-auth0-spa";
import { hasSubmittedBackground } from '../../api_callers/apis.json';

const UserDashboard = () => {
    const [type, setType] = useState('Loading');
    const [isOpen, setIsOpen] = useState(true);
    const [hasSubmittedForm, setHasSubmittedForm] = useState(false);
    // const [experienceLevel, setExperienceLevel] = useState(0);
    // const [interest, setInterest] = useState(null);
    // const [programmingLang, setProgrammingLang] = useState(null);

    const { loading, isAuthenticated, getTokenSilently } = useAuth0();

    React.useEffect(() => {

        const fetchHasSubmittedForm = async () => {
            try {
                const token = await getTokenSilently();
                const header = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await Axios.get(hasSubmittedBackground, header);
                const { hasSubmittedForm } = response.data;
                // console.log('hasSubmittedForm', hasSubmittedForm);
                setHasSubmittedForm(hasSubmittedForm);
                if (!hasSubmittedForm) {
                    setType('AccountType');
                }
                return response;

            } catch (err) {
                console.log(err);
            }
        }

        fetchHasSubmittedForm();

    }, [hasSubmittedForm, getTokenSilently])

    // console.log(type);

    const typeCheck = (type) => {
        setType(type);
    }

    const submitCheck = (value) => {
        setIsOpen(!value);
    }

    if (!isOpen) {
        return (
            <div>
                <UserNavBar />
            </div>
        );
    }

    return (

        <div>
            <UserNavBar />
            <TypeCheckForm
                type={type}
                onTypeClick={typeCheck}
                hasSubmittedForm={hasSubmittedForm}
            />
            <NormalForm
                type={type}
                hasSubmittedForm={hasSubmittedForm}
                onSubmitClick={submitCheck}
                onTypeClick={typeCheck}
            // onEducation={educationEventHandler}
            // onTopics={topicsEventHandler}
            // onLang={langEventHandler}
            // onInterview={interviewHandler}
            />
            <ExpertForm
                type={type}
                hasSubmittedForm={hasSubmittedForm}
                onSubmitClick={submitCheck}
                onTypeClick={typeCheck}
            />
        </div>
    );
}

export default UserDashboard;