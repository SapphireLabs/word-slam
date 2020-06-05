import React, { useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';

import { usePlayerState, useGameState } from '/imports/ui/core/hooks';
import { GameContext } from '/imports/ui/core/context';
import { Connections } from '/imports/ui/core/subscriptions';
import { Chat } from '/imports/ui/Chat';
import { statuses } from '/utils/constants';

import { Lobby } from './Lobby';
import { Round } from './Round';

export const Game = () => {
    const { accessCode } = useParams();
    const { isLoading: isPlayerLoading, player, playerId } = usePlayerState();
    const { isLoading: isGameLoading, game, players, rounds, chats } = useGameState(accessCode);
    const isLoading = isPlayerLoading || isGameLoading;
    const isInvalid = !game || !playerId || !player || (player && game._id !== player.gameId);
    const currentRound = rounds && rounds.find((r) => r.status !== statuses.COMPLETED);

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
        <GameContext.Provider
            value={{
                game,
                currentPlayer: player,
                playersInGame: players,
                rounds,
                currentRound,
                chats,
            }}
        >
            {game.status === 'WAITING' ? (
                <Lobby />
            ) : (
                <Round game={game} player={player} players={players} rounds={rounds} />
            )}
            <Chat chats={chats} gameId={game._id} playerId={player._id} players={players} />
        </GameContext.Provider>
    );
};
