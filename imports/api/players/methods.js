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
        console.log('Method - Players.add / run', gameId);
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

export const remove = new ValidatedMethod({
    name: 'Players.remove',
    validate: new SimpleSchema({
        _id: {
            type: String,
            optional: true,
        },
    }).validator(),
    run: ({ _id }) => {
        const response = {
            success: false,
            message: 'There was some server error.',
        };
        const player = Players.findOne({ _id }, { fields: Players.publicFields });

        if (player) {
            Players.remove({ _id });
            Chats.insert({ gameId: player.gameId, message: `${player.name} has left the game.` });

            response.success = true;
            response.message = 'Player removed.';
        }

        return response;
    },
});
