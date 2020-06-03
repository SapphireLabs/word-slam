import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { get } from 'lodash';
import { Disconnected } from 'meteor/blindinglight:disconnected';

import { Connections } from '/imports/ui/core/subscriptions';
import { add as addGame, Games } from '/imports/api/games';
import { add as addPlayer } from '/imports/api/players';
import { usePlayerState } from '/imports/ui/core/hooks';
import { CreateForm } from './CreateForm';

export const Create = () => {
    const { player, setPlayerId } = usePlayerState();
    const history = useHistory();
    const location = useLocation();

    /**
     * Either creates new game or joins existing game if user was redirected
     * to here from visiting a game link
     *
     * @param {{ name: String }} values
     */
    const onSubmit = (values) => {
        const accessCode = get(location, 'state.accessCode');
        const playerId = get(player, '_id');

        if (accessCode) {
            // if joining
            const game = Games.findOne({ accessCode }, { fields: Games.publicFields });

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
            }
            // TODO: handle joining invalid game
        } else {
            // creating new game
            addGame.call({}, (_, { gameId }) => {
                const game = Games.findOne({ _id: gameId }, { fields: Games.publicFields });

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
            <CreateForm onSubmit={onSubmit} />
        </>
    );
};
