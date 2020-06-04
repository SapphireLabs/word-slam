import React, { useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { usePlayerState, useGameState, useStoryWord } from '/imports/ui/core/hooks';
import { Connections } from '/imports/ui/core/subscriptions';
import { Chat } from '/imports/ui/Chat';
import { Lobby } from './Lobby';
import { Round } from './Round';

export const Game = () => {
    const { accessCode } = useParams();
    const { word, category } = useStoryWord();
    const { isLoading: isPlayerLoading, player, playerId } = usePlayerState();
    const { isLoading: isGameLoading, game, players, rounds, chats } = useGameState(accessCode);
    const isLoading = isPlayerLoading || isGameLoading;
    const isInvalid = !game || !playerId || !player || (player && game._id !== player.gameId);

    useEffect(() => {
        if (!isLoading && !isInvalid) {
            Connections.assign({ playerId, gameId: game._id });
        }
    }, [isLoading, isInvalid]);

    if (isLoading) {
        return null;
    }

    if (isInvalid) {
        return <Redirect to={{ pathname: '/', state: { accessCode } }} />;
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
            <Chat chats={chats} gameId={game._id} playerId={player._id} players={players} />
        </>
    );
};
