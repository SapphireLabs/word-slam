import { Meteor } from 'meteor/meteor';

import { Players } from './collection';

if (Meteor.isServer) {
    Meteor.publish('allPlayers', () => {
        return Players.find({}, { fields: Players.publicFields });
    });
}
