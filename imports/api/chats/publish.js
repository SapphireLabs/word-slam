import { Meteor } from 'meteor/meteor';

import { Chats } from './collection';

if (Meteor.isServer) {
    Meteor.publish('chats', (gameId) => {
        return Chats.find({ gameId }, { fields: Chats.publicFields });
    });
}
