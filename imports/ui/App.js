import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Container } from '@material-ui/core';

import { Create } from './Menu';
import { Game } from './Game';

import './App.scss';

export const App = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <Container maxWidth="sm">
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
            </Container>
        </DndProvider>
    );
};
