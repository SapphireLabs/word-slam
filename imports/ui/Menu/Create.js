import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { get } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import Alert from '@material-ui/lab/Alert';

import { add as addGame, Games } from '/imports/api/games';
import { add as addPlayer } from '/imports/api/players';
import { add as addRound } from '/imports/api/rounds';
import { usePlayerState } from '/imports/ui/core/hooks';
import { CreateForm } from './CreateForm';

export const Create = () => {
    const { player, setPlayerId } = usePlayerState();
    const history = useHistory();
    const location = useLocation();
    const accessCode = get(location, 'state.accessCode');
    const [game, isLoading] = useTracker(() => {
        const subscription = Meteor.subscribe('allGames');

        return [Games.findOne({ accessCode }), !subscription.ready()];
    }, [accessCode]);

    /**
     * Either creates new game or joins existing game if user was redirected
     * to here from visiting a game link
     *
     * @param {{ name: String }} values
     */
    const onSubmit = (values) => {
        const playerId = get(player, '_id');

        // if joining
        if (game) {
            addPlayer.call(
                { _id: playerId, name: values.name, gameId: game._id },
                (error, response) => {
                    if (response.playerId) {
                        setPlayerId(response.playerId);
                    }
                    history.push(`/games/${game.accessCode}`);
                }
            );
        } else {
            // create new game
            addGame.call({}, (_, { gameId }) => {
                const game = Games.findOne({ _id: gameId });

                addRound.call({ gameId });
                addPlayer.call({ _id: playerId, name: values.name, gameId }, (error, response) => {
                    if (response.playerId) {
                        setPlayerId(response.playerId);
                    }
                    history.push(`/games/${game.accessCode}`);
                });
            });
        }
    };

    return (
        <>
            {!isLoading && !!accessCode && !game && (
                <Alert severity="warning">
                    Invalid access code "{accessCode}". You can create a new game here.
                </Alert>
            )}
            <CreateForm onSubmit={onSubmit} />
        </>
    );
};
