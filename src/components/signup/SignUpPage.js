import React from 'react';
import NavBar from '../NavBar';
import SignUpForm from './SignUpForm';
import Background from '../../images/christina-wocintechchat-com-vzfgh3RAPzM-unsplash.jpg'


const SignUpPage = () => {
    return (
        <div>
            <NavBar />
            <SignUpForm />
            <img
                src={Background}
                alt="background pic"
                className="background-image" />
        </div>
    )
}

export default SignUpPage;