import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Players } from './collection';
import { Chats } from '../chats';

export const add = new ValidatedMethod({
    name: 'Players.add',
    validate: new SimpleSchema({
        _id: {
            type: String,
            optional: true,
        },
        name: {
            type: String,
        },
        gameId: {
            type: String,
        },
    }).validator(),
    run: ({ _id, name, gameId, isStoryteller = false, team = null }) => {
        const user = Meteor.user();
        console.log('Method - Players.add / run', user);

        const response = {
            success: false,
            message: 'There was some server error.',
        };

        const playerId = Players.upsert(
            { _id },
            {
                $set: {
                    name,
                    gameId,
                    isStoryteller,
                    team,
                },
            }
        );
        Chats.insert({
            gameId,
            message: `${name} has joined the game!`,
        });

        if (playerId) {
            response.success = true;
            response.message = 'Player added.';
            response.playerId = playerId.insertedId;
        }

        return response;
    },
});
