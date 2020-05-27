import { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { Players } from '/imports/api/players';
import { Games } from '/imports/api/games';

const PLAYER_ID_KEY = 'word-slam-player-id';

export const usePlayerState = () => {
    const [playerId, updatePlayerId] = useState(localStorage.getItem(PLAYER_ID_KEY));

    const setPlayerId = (id) => {
        localStorage.setItem(PLAYER_ID_KEY, id);
        updatePlayerId(id);
    };

    const player = useTracker(() => {
        return Players.findOne({ _id: playerId }, { fields: Players.publicFields });
    }, [playerId]);

    return {
        player,
        playerId,
        setPlayerId,
    };
};

export const useGameState = (accessCode) => {
    const game = useTracker(() => Games.findOne({ accessCode }, { fields: Games.publicFields }));
    const players = useTracker(() => Players.find({ gameId: game && game._id }, { fields: Players.publicFields }).fetch());

    return {
        game,
        players
    };
};
