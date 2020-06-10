import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import LandingPage from './landingpage/LandingPage';
import About from './about/About';
import history from '../history';
import FAQ from './faq/FAQ';
import Profile from './userprofile/Profile';
import UserDashboard from './dashboard/UserDashboard';
import Callback from './callback';

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
                        <Route path="/dashboard" component={UserDashboard} />
                        <Route path="/callback" component={Callback} />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;