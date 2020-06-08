import React from 'react';
import NavBar from '../NavBar';
import Background from '../../images/christina-wocintechchat-com-vzfgh3RAPzM-unsplash.jpg'
import LoginForm from './LoginForm';

const LogIn = () => {
    return (
        <div>
            <NavBar />
            <LoginForm />
            <img
                src={Background}
                alt="background pic"
                className="background-image" />
        </div>
    )
}

export default LogIn;