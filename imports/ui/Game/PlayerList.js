import React from 'react';
import T from 'prop-types';

import { views } from '/utils';

export const PlayerList = ({ playerClass, players, type }) => {
    return (
        <>
            {players.map((player) => (
                <div key={`${player._id}`} className={playerClass}>
                    {player.name}
                    {!player.isConnected ? ' (Disconnected)' : ''}
                    {player.isConnected && player.view === views.RESULTS
                        ? ' (Viewing results)'
                        : ''}
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
