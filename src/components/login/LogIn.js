import React from 'react';
import { useAuth0 } from '../../react-auth0-spa';
import NavBar from '../NavBar';
import Background from '../../images/christina-wocintechchat-com-vzfgh3RAPzM-unsplash.jpg'
import LoginForm from './LoginForm';

const LogIn = () => {
    const{ loading } = useAuth0();

    console.log(loading)
    if(loading){
        return <div>Loading...</div>
    }

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