import { Meteor } from 'meteor/meteor';

import { Games } from './collection';

if (Meteor.isServer) {
    Meteor.publish('allGames', () => {
        return Games.find({}, { fields: Games.publicFields });
    });

    Meteor.publish('oneGame', (accessCode) => {
        return Games.find({ accessCode }, { fields: Games.publicFields });
    });
}
