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
                    At your own convenience.
                </h3>
            </div>
            <Link to={"/login"}
                className="ui button"
                style={
                    {
                        backgroundColor: '#0136bf',
                        color: 'white',
                        width: '25em',
                        fontSize: '1em'
                    }}>
                Start Practicing!
            </Link>
        </div >
    );
}

export default DescriptionBox;