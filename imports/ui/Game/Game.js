import React from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { usePlayerState, useGameState, useStoryWord } from '/imports/ui/core';
import { Chat } from '/imports/ui/Chat';
import { Lobby } from './Lobby';
import { Round } from './Round';

export const Game = () => {
    const { accessCode } = useParams();
    const { word, category } = useStoryWord();
    const { player, playerId } = usePlayerState();
    const { game, players, rounds } = useGameState(accessCode);

    if (!game) {
        return null;
    }

    if (game && (!playerId || (player && game._id !== player.gameId))) {
        return <Redirect to={{ pathname: '/', state: { accessCode } }} />;
    }

    if (!player) {
        return null;
    }

    return (
        <>
            {game.status === 'WAITING' ? (
                <Lobby
                    game={game}
                    player={player}
                    players={players}
                    word={word}
                    category={category}
                />
            ) : (
                <Round game={game} player={player} players={players} rounds={rounds} />
            )}
            <Chat gameId={game._id} playerId={player._id} players={players} />
        </>
    );
};
