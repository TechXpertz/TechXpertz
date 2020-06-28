import React from 'react';
import './InterviewRoom.css';

const SubHeader = () => {
    return (
        <div className="subheader-text">
            <div className="ui right aligned container">
                <p style={{ fontSize: '18px'}}>
                It’s your peer’s turn to interview you. Click on swap roles once you have completed the question.
                </p>
            </div>
            <div className="ui right aligned container" style={{width: '300px'}}>
                <button className="compact ui medium right labeled icon button">
                    Swap roles
                    <i className="exchange alternate icon" />
                </button>
            </div>
        </div>
    );
};

export default SubHeader;
