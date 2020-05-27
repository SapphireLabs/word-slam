import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { generateAccessCode } from '/utils';

export const Games = new Mongo.Collection('games');

const Schemas = {};

Schemas.Game = new SimpleSchema({
    accessCode: {
        type: String,
        index: 1,
        unique: true,
        autoValue: function() {
            if (this.isInsert) {
                let accessCode = generateAccessCode();
                const used = new Set(Games.find().fetch().map(game => game.accessCode));

                while (used.has(accessCode)) {
                    accessCode = generateAccessCode();
                }

                return accessCode;
            } else {
                this.unset(); // prevent user from supplying their own value
            }
        },
    },
});

Games.attachSchema(Schemas.Game);
