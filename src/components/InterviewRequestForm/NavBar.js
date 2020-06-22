import React from 'react';
import Logo from '../../images/Logo.png';

const NavBar = () => {
    return (
        <div className="ui inverted top fixed menu borderless">
            <img
                src={Logo} alt="Application logo"
                className="logo"
                style={{ marginTop: '12px', marginLeft: '40px' }}
            />
            <div className="item" style={{ marginLeft: '40em' }}>
                <h2>Book Your Interview</h2>
            </div>
        </div>
    )
}

export default NavBar;