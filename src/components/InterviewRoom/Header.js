import React from 'react';
import './InterviewRoom.css';

const Header = () => {
    return (
        <div className="header-text">
            <div className="ui right aligned container">
                <h3>Interview Room</h3>
            </div>
            <div className="ui right aligned container" style={{ width: '1000px' }}>
                <button className='compact ui red medium right labeled icon button' style={{ color: 'black' }}>
                    Exit Session
                    <i className="window close outline icon" />
                </button>
            </div>
        </div>
    );
};

export default Header;