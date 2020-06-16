import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '../../react-auth0-spa';
import '../Image.css';

const DescriptionBox = () => {
    const { isAuthenticated, loginWithRedirect, loading } = useAuth0();

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
            <div className="aaaaa">
                {!isAuthenticated && !loading && (
                    <button onClick={() => loginWithRedirect({})} 
                    className="ui primary button" >
                    Start Practicing!
                </button>)}

                {loading && (
                    <button className="ui primary loading button" style={{ width: '22em' }} />
                )}

                {isAuthenticated && 
                <Link to="/dashboard" className="bbbbb">
                        <button className="ui primary button">
                            You are already logged in. Proceed to dashboard!
                        </button>
                </Link>}
            </div>
        </div >
    );
}

export default DescriptionBox;