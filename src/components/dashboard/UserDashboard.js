import React, { useState } from 'react';
import UserNavBar from './UserNavBar';
import NormalForm from './NormalForm';
import ExpertForm from './ExpertForm';
import TypeCheckForm from './TypeCheckForm';
//import { useAuth0 } from '../../react-auth0-spa';

const UserDashboard = () => {
    //const { isAuthenticated, logout } = useAuth0();

    const [type, setType] = useState('AccountType');
    // const [experience, setExperience] = useState(true);
    // const [experienceLevel, setExperienceLevel] = useState(0);
    // const [interst, setInterest] = useState([]);
    // const [progLang, setProgLang] = useState([]);

    const typeCheck = (type) => {
        setType(type);
        // console.log(type);
    }

    console.log(type)
    return (
        <div>
            <UserNavBar />
            <TypeCheckForm
                type={type}
                onTypeClick={typeCheck}
            />
            <NormalForm
                type={type}
            />
            <ExpertForm
                type={type}
            />
        </div>
    );
}

export default UserDashboard;