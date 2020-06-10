import React from 'react';
import { Link } from 'react-router-dom';
import Divider from '../Divider';
import { useAuth0 } from "../../react-auth0-spa";
import "./Login.css"

const LoginForm = () => {
    const{ isAuthenticated, loginWithRedirect, logout } = useAuth0();

    console.log(isAuthenticated);

    return (
        <div className="ui right aligned grid">
            <div
                className="right floated left aligned six wide column"
                style={{ top: '15em', right: '21px', maxWidth: "400px" }}
            >
                <h2 className="ui center aligned header" style={{
                    top: '7em',
                    right: '2.1em'
                }}>
                    Welcome Back
                </h2>
                <form className="ui form">
                    <div className="ui stacked segment">
                        <div className="field">
                            <label>Username</label>
                            <input type="text" name="username" placeholder="Username" />
                        </div>
                        <div className="field">
                            <label>Password</label>
                            <input type="text" name="password" placeholder="Password" />
                        </div>
                        <button className="ui primary large fluid button" type="submit">Log in</button>
                    </div>
                    <div className="field">
                        <Link to="/signup">
                            <h5>Forgot your password?</h5>
                        </Link>
                    </div>
                </form>
                <Divider text="or" />
                <div>
                { !isAuthenticated && (
                    <button
                    className="ui red google large fluid button"
                    style={{
                        marginTop: "10px",
                    }}
                    onClick={() => loginWithRedirect({})}
                >
                    <i className="google icon" />
                    Continue with Google
                </button>
                )}
                </div>
                <div className="ui message">
                    Don't have an account?
                    <Link to="/signup" style={{ marginLeft: "4px" }}>
                        Sign up
                    </Link>
                </div>
            </div>
        </div>

    );
}

export default LoginForm;