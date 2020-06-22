import React, { useState, useEffect } from 'react';
import UserNavBar from './UserNavBar';
import NormalForm from './NormalForm';
import ExpertForm from './ExpertForm';
import TypeCheckForm from './TypeCheckForm';

const UserDashboard = () => {
    const [type, setType] = useState('AccountType');
    const [isOpen, setIsOpen] = useState(true);
    const [educationLevel, setEducationLevel] = useState(null);
    const [experience, setExperience] = useState('');
    // const [experienceLevel, setExperienceLevel] = useState(0);
    const [interest, setInterest] = useState(null);
    const [programmingLang, setProgrammingLang] = useState(null);

    console.log(type);

    const typeCheck = (type) => {
        setType(type);
    }

    const submitCheck = (value) => {
        setIsOpen(!value);
    }

    if(!isOpen){
        return (
            <div>
                <UserNavBar />
            </div>
        );
    }

    return(
        <div>
            <UserNavBar />
            <TypeCheckForm
                type={type}
                onTypeClick={typeCheck}
            />
            <NormalForm
                type={type}
                onSubmitClick={submitCheck}
                onTypeClick={typeCheck}
                // onEducation={educationEventHandler}
                // onTopics={topicsEventHandler}
                // onLang={langEventHandler}
                // onInterview={interviewHandler}
            />
            <ExpertForm
                type={type}
                onSubmitClick={submitCheck}
                onTypeClick={typeCheck}
            />
        </div>
    );
}

export default UserDashboard;