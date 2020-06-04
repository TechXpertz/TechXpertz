import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/Logo.png';
import './App.css';

const NavBar = () => {
    return (
        <div className="ui inverted top fixed menu borderless">
            <img
                src={Logo} alt="Application logo"
                className="logo"
                style={{ marginTop: '12px', marginLeft: '40px' }}
            />
            <div className="right menu">
                <Link
                    to="/about"
                    className="item"
                    id="fonts"
                    style={{ paddingRight: '30px', paddingLeft: '30px' }}
                >
                    About us
                </Link>
                <Link
                    to="/FAQ"
                    className="item"
                    id="fonts"
                    style={{ paddingRight: '30px', paddingLeft: '30px' }}
                >
                    FAQ
                </Link>
            </div>
        </div>
    );
}

export default NavBar;