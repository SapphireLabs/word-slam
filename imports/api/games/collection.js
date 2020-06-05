import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { Players } from '/imports/api/players';
import { Rounds } from '/imports/api/rounds';
import { Chats } from '/imports/api/chats';
import { generateAccessCode } from '/utils';

export const Games = new Mongo.Collection('games');

Games.schema = new SimpleSchema({
    accessCode: {
        type: String,
        index: 1,
        unique: true,
        autoValue: function() {
            if (this.isInsert) {
                let accessCode = generateAccessCode();
                const used = new Set(
                    Games.find()
                        .fetch()
                        .map((game) => game.accessCode)
                );

                while (used.has(accessCode)) {
                    accessCode = generateAccessCode();
                }

                return accessCode;
            } else {
                this.unset(); // prevent user from supplying their own value
            }
        },
    },
    status: {
        type: String,
        defaultValue: 'WAITING',
    },
    isSingleTeam: {
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

Games.publicFields = {
    accessCode: 1,
    status: 1,
    isSingleTeam: 1,
};

Games.attachSchema(Games.schema);

Games.helpers({
    players() {
        return Players.find({ gameId: this._id }, { fields: Players.publicFields });
    },
    rounds() {
        return Rounds.find({ gameId: this._id }, { fields: Rounds.publicFields });
    },
    chats() {
        return Chats.find({ gameId: this._id }, { fields: Chats.publicFields });
    },
});
