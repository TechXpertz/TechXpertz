import React from 'react';
import NavBar from '../NavBar';
import DescriptionBox from './DescriptionBox';
import '../Image.css';
import LandingPic from '../../images/emile-perron-xrVDYZRGdw4-unsplash.jpg'

const LandingPage = () => {
    return (
        <div>
            <img src={LandingPic} alt="LandingPic" className="landing-pic" />
            <DescriptionBox />
            <NavBar />
        </div>
    );
}

export default LandingPage;