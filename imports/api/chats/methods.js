import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Chats } from './collection';
import { Players } from '../players';
import { Rounds } from '../rounds';

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
        console.log('Method - Chats.add / run');

        const response = {
            success: false,
            message: 'There was some server error.',
        };

        const player = Players.findOne({ _id: playerId });
        const _id = Chats.insert({ message, gameId, playerId, team: player.team });

        const currentRound = Rounds.findOne(
            { gameId, status: 'IN_PROGRESS' },
            { fields: Rounds.publicFields }
        );
        let isRoundComplete = false;

        if (currentRound) {
            console.log('Method - Chats.add / guess');
            const { word } = currentRound;

            if (!player.isStoryteller && player.team && word.length === message.length) {
                if (word.match(new RegExp(message, 'i'))) {
                    Chats.insert({
                        gameId,
                        message: `${player.name} has guessed the word!`,
                    });
                    Rounds.update(
                        { _id: currentRound._id },
                        {
                            $set: {
                                status: 'COMPLETED',
                                winnerId: playerId,
                            },
                        }
                    );
                    isRoundComplete = true;
                }
            }
        }

        if (_id) {
            response.success = true;
            response.message = 'Chat added.';
            response.gameId = _id;
            response.isRoundComplete = isRoundComplete;
        }

        return response;
    },
});
