import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import LandingPage from './landingpage/LandingPage';
import LogIn from './login/LogIn';
import SignUpPage from './signup/SignUpPage';
import About from './about/About';
import history from '../history';
import FAQ from './faq/FAQ';

const App = () => {
    return (
        <div>
            <Router history={history}>
                <div>
                    <Switch>
                        <Route path="/" exact component={LandingPage} />
                        <Route path="/about" component={About} />
                        <Route path="/FAQ" component={FAQ} />
                        <Route path="/login" component={LogIn} />
                        <Route path="/signup" component={SignUpPage} />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;