import { Meteor } from 'meteor/meteor';

import { Games } from './collection';

if (Meteor.isServer) {
    Meteor.publish('games', () => {
        return Games.find();
    });
}
