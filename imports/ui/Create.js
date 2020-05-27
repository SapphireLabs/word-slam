import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { get } from 'lodash';

import { add as addGame, Games } from '/imports/api/games';
import { add as addPlayer } from '/imports/api/players';
import { usePlayerState } from './core';

export const Create = (props) => {
    const { player, setPlayerId } = usePlayerState();
    const [name, setName] = useState('');
    const history = useHistory();
    const location = useLocation();

    const onChange = (e) => {
        setName(e.target.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (name) {
            const accessCode = get(location, 'state.accessCode');

            if (accessCode) {
                // if joining
                const game = Games.findOne({ accessCode }, { fields: Games.publicFields });

                if (game) {
                    addPlayer.call({ _id: get(player, '_id'), name, gameId: game._id }, (error, response) => {
                        if (response.playerId) {
                            setPlayerId(response.playerId);
                        }
                        history.push(`/games/${game.accessCode}`);
                    });
                }
            } else {
                // creating new game
                addGame.call({}, (_, { gameId }) => {
                    const game = Games.findOne({ _id: gameId }, { fields: Games.publicFields });

                    addPlayer.call({ _id: get(player, '_id'), name, gameId }, (error, response) => {
                        if (response.playerId) {
                            setPlayerId(response.playerId);
                        }
                        history.push(`/games/${game.accessCode}`);
                    });
                });
            }
        }
    };

    return (
      <div>
          <form id="player" onSubmit={onSubmit} >
              <input
                  type="text"
                  placeholder="Player name"
                  onChange={onChange}
                  value={name}
              />
              <button type="submit" form="player">Play</button>
          </form>
      </div>
    );
};
