import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Games } from './collection';

export const add = new ValidatedMethod({
    name: 'Games.add',
    validate: null,
    run: () => {
        const user = Meteor.user();
        console.log('Method - Games.add / run', user);

        const response = {
            success: false,
            message: 'There was some server error.'
        };

        const _id = Games.insert({});

        if (_id) {
            response.success = true;
            response.message = 'Game added.';
            response.gameId = _id;
        }

        return response;
    },
})
