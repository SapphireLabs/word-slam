import { Meteor } from 'meteor/meteor';

import { Rounds } from './collection';

if (Meteor.isServer) {
    Meteor.publish('rounds', () => {
        return Rounds.find();
    });
}
