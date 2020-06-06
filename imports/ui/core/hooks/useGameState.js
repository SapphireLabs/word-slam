import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import { Games } from '/imports/api/games';

export const useGameState = (accessCode) => {
    return useTracker(() => {
        const subscription = Meteor.subscribe('oneGame', accessCode);
        const game = Games.findOne({ accessCode });
        let loading = false;

        if (game) {
            loading = loading || !Meteor.subscribe('chats', game._id).ready();
            loading = loading || !Meteor.subscribe('rounds', game._id).ready();
        }

        return {
            isLoading: !subscription.ready() || loading,
            game,
            players: game && game.players().fetch(),
            rounds: game && game.rounds().fetch(),
            chats: game && game.chats().fetch(),
        };
    });
};
