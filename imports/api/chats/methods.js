import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { statuses, views } from '/utils/constants';

import { Chats } from './collection';
import { Players, updateStats } from '../players';
import { add as addRound, endRound, Rounds } from '../rounds';
import { Games } from '../games';

export const add = new ValidatedMethod({
    name: 'Chats.add',
    validate: new SimpleSchema({
        message: {
            type: String,
        },
        gameId: {
            type: String,
        },
        playerId: {
            type: String,
        },
    }).validator(),
    run: ({ gameId, playerId, message }) => {
        console.log('Method - Chats.add / run', playerId);

        const response = {
            success: false,
            message: 'There was some server error.',
            isRoundComplete: false,
        };

        const player = Players.findOne({ _id: playerId });
        // save player details in chat object so we have it even if player leaves game
        const _id = Chats.insert({
            message,
            gameId,
            playerId,
            name: player.name,
            team: player.team,
        });

        const currentRound = Rounds.findOne({ gameId, status: statuses.IN_PROGRESS });

        if (currentRound) {
            console.log('Method - Chats.add / guess');
            const { word } = currentRound;

            if (!player.isStoryteller && player.team && word.length === message.length) {
                if (word.match(new RegExp(message, 'i'))) {
                    endRound.call({ _id: currentRound._id, playerId: playerId });
                    response.isRoundComplete = true;
                }
            }
        }

        if (_id) {
            response.success = true;
            response.message = 'Chat added.';
            response.gameId = _id;
        }

        return response;
    },
});
