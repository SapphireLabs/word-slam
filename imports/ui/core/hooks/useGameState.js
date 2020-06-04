import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { Games } from '../../../api/games';
import { Players } from '../../../api/players';
import { Rounds } from '../../../api/rounds';

export const useGameState = (accessCode) => {
    const gameSubscription = Meteor.subscribe('games');

    const game = useTracker(() => Games.findOne({ accessCode }, { fields: Games.publicFields }));
    const players = useTracker(() =>
        Players.find({ gameId: game && game._id }, { fields: Players.publicFields }).fetch()
    );
    const rounds = useTracker(() =>
        Rounds.find({ gameId: game && game._id }, { fields: Rounds.publicFields }).fetch()
    );

    return {
        game,
        players,
        rounds,
    };
};
