import React from 'react';
import T from 'prop-types';

export const PlayerList = ({ playerClass, players, type }) => {
    return (
        <>
            {players.map((player) => (
                <div key={`${player._id}`} className={playerClass}>
                    {player.name}
                    {!player.isConnected ? ' (Disconnected)' : ''}
                </div>
            ))}
        </>
    );
};

PlayerList.propTypes = {
    playerClass: T.string,
    players: T.array.isRequired,
    type: T.string.isRequired,
};
