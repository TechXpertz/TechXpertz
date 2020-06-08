import React from 'react';
import { Link } from 'react-router-dom';
import '../Image.css';

const DescriptionBox = () => {
    return (
        <div className="ui text container">
            <div className="description-box">
                <h1>
                    Master Your Skills To Ace Your
                <br />
                    Next Coding Technical Interview
                </h1>
                <h3>
                    Start practicing live mock interviews with your peers
                    <br />
                    to be better prepared for your next major interview.
                    <br />
                    At your own time. At your own convenience.
                </h3>
            </div>
            <Link to={"/login"}
                className="ui primary button"
                style={
                    {
                        position: 'relative',
                        top: '1em',
                        right: '18em',
                        width: '22em',
                    }}>
                Start Practicing!
            </Link>
        </div >
    );
}

export default DescriptionBox;