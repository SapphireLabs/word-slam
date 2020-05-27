import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';

import { Create } from './Create';
import { Game } from './Game';

export const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/games/:accessCode">
                    <Game />
                </Route>
                <Route path="/">
                    <Create />
                </Route>
            </Switch>
        </Router>
    );
}
