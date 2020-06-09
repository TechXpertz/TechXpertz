import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '../../react-auth0-spa';
import Divider from '../Divider';

const SignUpForm = () => {
    //cosnt 

    return (
        <div className="ui right aligned grid">
            <div
                className="right floated left aligned six wide column"
                style={{ top: '9em', right: '21px', maxWidth: "400px" }}
            >
                <h2 className="ui center aligned header" style={{
                    top: '7em',
                    right: '2.1em'
                }}>
                    Create Account
                    </h2>
                <form className="ui form">
                    <div className="ui stacked segment">
                        <div className="field">
                            <label>Name</label>
                            <input type="text" name="name" placeholder="Name" />
                        </div>
                        <div className="field">
                            <label>Username</label>
                            <input type="text" name="username" placeholder="Usernsame" />
                        </div>
                        <div className="field">
                            <label>Email</label>
                            <input type="text" name="email" placeholder="Email" />
                        </div>
                        <div className="field">
                            <label>Password</label>
                            <input type="text" name="password" placeholder="Password" />
                        </div>
                        <div className="field">
                            <label>Confirm Password</label>
                            <input type="text" name="confirm password" placeholder="Confirm Password" />
                        </div>
                        <button class="ui primary large fluid button" type="submit">Sign up</button>
                    </div>
                </form>
                <Divider text="or" />
                <button
                    className="ui red google large fluid button"
                    style={{
                        marginTop: "10px",
                    }}
                >
                    <i className="google icon" />
                    Continue with Google
                    </button>
                <div className="ui message">
                    Already have an account?
                    <Link to="/login" style={{ marginLeft: "4px" }}>
                        Log in
                    </Link> 
                </div>
            </div>
        </div>

    );
}

export default SignUpForm