import React, { useState } from 'react';
import UserNavBar from './UserNavBar';
import MainDashboard from './MainDashboard';
import NormalForm from './NormalForm';
import ExpertForm from './ExpertForm';
import TypeCheckForm from './TypeCheckForm';

const UserDashboard = () => {
    const [type, setType] = useState('AccountType');
    const [isOpen, setIsOpen] = useState(false);
    // const [experienceLevel, setExperienceLevel] = useState(0);
    // const [interest, setInterest] = useState(null);
    // const [programmingLang, setProgrammingLang] = useState(null);

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
                <MainDashboard />
            </div>
        );
    }
  
    return (

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