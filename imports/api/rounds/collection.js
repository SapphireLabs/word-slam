import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Rounds = new Mongo.Collection('rounds');

Rounds.schema = new SimpleSchema({
    gameId: {
        type: String,
    },
    team: {
        type: String,
        optional: true,
    },
    target: {
        type: String,
        autoValue: function() {
            if (this.isInsert) {
                // TODO: generate target word
                const target = 'target';

                return target;
            } else {
                this.unset();
            }
        },
    },
    winnerId: {
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

Rounds.publicFields = {
    gameId: 1,
    team: 1,
    target: 1,
    winnerId: 1,
};

Rounds.attachSchema(Rounds.schema);
