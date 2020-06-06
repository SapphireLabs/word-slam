import { Meteor } from 'meteor/meteor';

import { Rounds } from './collection';

if (Meteor.isServer) {
    Meteor.publish('rounds', (gameId) => {
        return Rounds.find({ gameId }, { fields: Rounds.publicFields, sort: { createdAt: -1 } });
    });
}
