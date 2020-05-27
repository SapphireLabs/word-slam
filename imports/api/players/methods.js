import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Players } from './collection';

export const add = new ValidatedMethod({
    name: 'Players.add',
    validate: new SimpleSchema({
        name: {
            type: String,
        },
        gameId: {
            type: String,
        },
    }).validator(),
    run: ({ name, gameId }) => {
        const user = Meteor.user();
        console.log('Method - Players.add / run', user);

        const response = {
            success: false,
            message: 'There was some server error.'
        };

        const success = Players.insert({
            name,
            gameId,
        });

        if (success) {
            response.success = true;
            response.message = 'Player added.';
        }

        return response;
    },
})
