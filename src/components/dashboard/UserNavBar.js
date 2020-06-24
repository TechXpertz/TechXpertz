import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '../../react-auth0-spa';
import Logo from '../../images/Logo.png'
import Select from 'react-select';
import '../App.css';
import './Dashboard.css';

const NavBar = () => {
        const { isAuthenticated, logout } = useAuth0();
            return (
                <div className="ui inverted top fixed menu borderless">
                    <img
                        src={Logo} alt="Application logo"
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
                    <div className="item">
                        <i className="grey bell icon" />
                    </div>
                </div>
            </div>
        );
    }


export default NavBar;