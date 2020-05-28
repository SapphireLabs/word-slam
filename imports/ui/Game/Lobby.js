import React from 'react';
import T from 'prop-types';

export const Lobby = ({ game, player, players }) => {

    return (
        <div>
            <div>
                Game access code: {accessCode}
            </div>
            <div>
                Status: {game.status}
            </div>
            <ul>
                {players.map((player, i) => (
                    <li key={`player-${i}`}>{player.name}</li>
                ))}
            </ul>
        </div>
    );
};

Lobby.propTypes = {
    game: T.object.isRequired,
    player: T.object.isRequired,
    players: T.arrayOf(Lobby.propTypes.player),
};
