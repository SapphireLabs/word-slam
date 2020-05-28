import React from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { usePlayerState, useGameState } from '/imports/ui/core';
import { Lobby } from './Lobby';

export const Game = () => {
    const { accessCode } = useParams();
    const { player, playerId } = usePlayerState();
    const { game, players } = useGameState(accessCode);
    console.log(game, player);

    if (!game || !player) {
        return null;
    }

    if (game && (!playerId || (player && game._id !== player.gameId))) {
        return <Redirect to={{ pathname: '/', state: { accessCode } }} />;
    }

    return game.status === 'WAITING' ? (
        <Lobby game={game} player={player} players={players} />
    ) : (
        <div>Round in progress</div>
    );
};
