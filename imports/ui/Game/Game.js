import React from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { usePlayerState, useGameState } from '/imports/ui/core';
import { Lobby } from './Lobby';
import { Round } from './Round';

export const Game = () => {
    const { accessCode } = useParams();
    const { player, playerId } = usePlayerState();
    const { game, players } = useGameState(accessCode);
    console.log(game, player);

    if (!game) {
        return null;
    }

    if (game && (!playerId || (player && game._id !== player.gameId))) {
        return <Redirect to={{ pathname: '/', state: { accessCode } }} />;
    }

    if (!player) {
        return null;
    }

    return game.status === 'WAITING' ? (
        <Lobby game={game} player={player} players={players} />
    ) : (
        <Round game={game} player={player} players={players} />
    );
};
