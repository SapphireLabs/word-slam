import React from 'react';
import { useHistory } from 'react-router-dom';

import { add as addGame, Games } from '/imports/api/games';
import { add as addPlayer } from '/imports/api/players';

export const Create = () => {
    const history = useHistory();

    const createGame = async () => {
        addGame.call({}, (_, { gameId }) => {
            const game = Games.findOne({ _id: gameId }, { fields: Games.publicFields });
            addPlayer.call({ name: 'player', gameId }, (response, error) => {
                console.log(response, error);

                history.push(`/games/${game.accessCode}`);
            });
        });
    };

    return (
      <div>
        <button onClick={createGame}>Create game</button>
      </div>
    );
};
