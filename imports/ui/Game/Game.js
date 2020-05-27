import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';

import { Players } from '/imports/api/players';
import { Games } from '/imports/api/games';

export const Game = () => {
    const { accessCode } = useParams();
    const game = useTracker(() => Games.find({ accessCode }));

    if (!game) {
        return <div>Game not found.</div>;
    }

    const players = useTracker(() => Players.find({ gameId: game._id }));

    return (
        <div>
            <div>
                Game access code: {accessCode}
            </div>
            <ul>
                {players.map((player, i) => (
                    <li key={`player-${i}`}>{player.name}</li>
                ))}
            </ul>
        </div>
    );
};
