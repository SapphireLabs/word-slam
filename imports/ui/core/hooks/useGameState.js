import { Meteor } from 'meteor/meteor';
import { useMemo } from 'react';
import { get } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';

import { Games } from '/imports/api/games';
import { statuses } from '/utils';

export const useGameState = (accessCode) => {
    const state = useTracker(() => {
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
    const isSingleTeam = get(state, 'game.isSingleTeam');
    const score = useMemo(() => {
        if (isSingleTeam) {
            // TODO: single player scores
            return null;
        }
        return get(state, 'rounds', []).reduce(
            (counts, r) => {
                if (r.status === statuses.COMPLETED && r.winnerTeam && !r.isSingleTeam) {
                    counts[r.winnerTeam]++;
                }

                return counts;
            },
            { Blue: 0, Red: 0 }
        );
    }, [state.rounds, isSingleTeam]);

    return { ...state, score };
};
