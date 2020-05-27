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

Players.attachSchema(Players.schema);
