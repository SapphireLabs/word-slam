import { Meteor } from 'meteor/meteor';
import { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { Players } from '/imports/api/players';

export const PLAYER_ID_KEY = 'word-slam-player-id';

export const usePlayerState = () => {
    const [playerId, updatePlayerId] = useState(localStorage.getItem(PLAYER_ID_KEY));
    const [player, isLoading] = useTracker(() => {
        const subscription = Meteor.subscribe('players');
        const player = Players.findOne({ _id: playerId }, { fields: Players.publicFields });

        return [player, !subscription.ready()];
    }, [playerId]);

    const setPlayerId = (id) => {
        localStorage.setItem(PLAYER_ID_KEY, id);
        updatePlayerId(id);
    };

    return {
        isLoading,
        player,
        playerId,
        setPlayerId,
    };
};
