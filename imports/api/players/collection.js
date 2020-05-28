import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Players = new Mongo.Collection('players');

Players.schema = new SimpleSchema({
    name: {
        type: String,
    },
    gameId: {
        type: String,
    },
    userId: {
        type: String,
        optional: true,
    },
    team: {
        type: String,
        optional: true,
    },
    isStoryteller: {
        type: Boolean,
        defaultValue: false,
    },
    isReady: {
        type: Boolean,
        defaultValue: false,
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

Players.publicFields = {
    name: 1,
    gameId: 1,
    userId: 1,
    team: 1,
    isStoryteller: 1,
    isReady: 1,
};

Players.attachSchema(Players.schema);
