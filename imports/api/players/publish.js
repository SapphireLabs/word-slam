import { Meteor } from 'meteor/meteor';

import { Players } from './collection';

if (Meteor.isServer) {
    Meteor.publish('players', () => {
        return Players.find();
    });
}
