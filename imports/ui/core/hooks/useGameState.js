import { useTracker } from 'meteor/react-meteor-data';

import { Games } from '../../../api/games';
import { Players } from '../../../api/players';

export const useGameState = (accessCode) => {
    const game = useTracker(() => Games.findOne({ accessCode }, { fields: Games.publicFields }));
    const players = useTracker(() =>
        Players.find({ gameId: game && game._id }, { fields: Players.publicFields }).fetch()
    );

    return {
        game,
        players,
    };
};
