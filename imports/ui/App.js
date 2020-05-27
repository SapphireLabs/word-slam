import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';

import { Create } from './Create';
import { Info } from './Info';
import { Game } from './Game';

export const App = () => (
    <Router>
        <Switch>
            <Route exact path="/games/:accessCode">
                <Game />
            </Route>
            <Route path="/">
                <h1>Welcome to Meteor!</h1>
                <Create/>
                <Info/>
            </Route>
        </Switch>
    </Router>
);
