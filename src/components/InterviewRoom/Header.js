import React from 'react';
import history from '../../history';
import './InterviewRoom.css';

const Header = () => {
    return (
        <div className="header-text">
            <div className="ui right aligned container">
                <h2>Interview Room</h2>
            </div>
            <div className="ui right aligned container" style={{ width: '1000px' }}>
                <button className='compact ui red medium right labeled icon button' style={{ color: 'black' }} onClick={() => history.push('/feedback-form-page')}>
                    Exit Session
                    <i className="window close outline icon" />
                </button>
            </div>
        </div>
    );
};

export default Header;