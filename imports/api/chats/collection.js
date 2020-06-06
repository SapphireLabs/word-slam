import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Chats = new Mongo.Collection('chats');

Chats.schema = new SimpleSchema({
    gameId: {
        type: String,
    },
    playerId: {
        type: String,
        optional: true,
    },
    message: {
        type: String,
    },
    team: {
        type: String,
        optional: true,
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return { $setOnInsert: new Date() };
            } else {
                this.unset();
            }
        },
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true,
    },
});

Chats.publicFields = {
    gameId: 1,
    playerId: 1,
    message: 1,
    team: 1,
};

Chats.attachSchema(Chats.schema);
