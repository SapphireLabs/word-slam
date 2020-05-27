import React from 'react';
import { Redirect, useLocation, useParams } from 'react-router-dom';

import { usePlayerState, useGameState } from '/imports/ui/core';

export const Game = () => {
    const location = useLocation();
    const { accessCode } = useParams();
    const { player, playerId } = usePlayerState();
    const { game, players } = useGameState(accessCode);
    console.log(player, game, players)

    if (game && !playerId) {
        return <Redirect to={{ pathname: '/', state: { accessCode } }} />;
    }

    return game ? (
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
    ) : null;
};
