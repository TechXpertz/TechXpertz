import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import LandingPage from './landingpage/LandingPage';
import About from './about/About';
import history from '../history';
import FAQ from './faq/FAQ';
import Profile from './userprofile/Profile';
import UserDashboard from './dashboard/UserDashboard';
import InterviewRequestForm from './InterviewRequestForm/InterviewRequestForm';
import Callback from './callback';
import SocketEditor from './backendTesting/socket/SocketEditor';
// import { useAuth0 } from "../react-auth0-spa";
// import { register } from "../api_callers/apis.json";

const App = () => {

    return (
        <div>
            <Router history={history}>
                <div>
                    <Switch>
                        <Route exact path="/" component={LandingPage} />
                        <Route path="/about" component={About} />
                        <Route path="/FAQ" component={FAQ} />
                        <Route path="/profile" component={Profile} />
                        {/* <Route
                            path='/dashboard'
                            render={(props) => (
                                <UserDashboard {...props} status={registerStatus[0]} />
                            )}
                        /> */}
                        <Route path="/dashboard" component={UserDashboard} />
                        <Route path="/callback" component={Callback} />
                        <Route path="/booking" component={InterviewRequestForm} />
                        <Route path="/socket-editor" component={SocketEditor} />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;