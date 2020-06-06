import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { get } from 'lodash';

import { views } from '/utils/constants';

export const Players = new Mongo.Collection('players');

const playerStatsType = new SimpleSchema({
    teamRoundsPlayed: {
        type: SimpleSchema.Integer,
        defaultValue: 0,
    },
    teamRoundsWon: {
        type: SimpleSchema.Integer,
        defaultValue: 0,
    },
    teamRoundsAsStoryteller: {
        type: SimpleSchema.Integer,
        defaultValue: 0,
    },
    teamRoundsWonAsStoryteller: {
        type: SimpleSchema.Integer,
        defaultValue: 0,
    },
    singleRoundsPlayed: {
        type: SimpleSchema.Integer,
        defaultValue: 0,
    },
    singleRoundsWon: {
        type: SimpleSchema.Integer,
        defaultValue: 0,
    },
    singleRoundsAsStoryteller: {
        type: SimpleSchema.Integer,
        defaultValue: 0,
    },
    wordsGuessed: {
        type: SimpleSchema.Integer,
        defaultValue: 0,
    },
    totGuessSecs: {
        type: Number,
        defaultValue: 0,
    },
    totStorytellerSecs: {
        type: Number,
        defaultValue: 0,
    },
});

Players.schema = new SimpleSchema({
    name: {
        type: String,
    },
    gameId: {
        type: String,
        optional: true,
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
    isConnected: {
        type: Boolean,
        defaultValue: true,
    },
    stats: {
        type: playerStatsType,
        defaultValue: {},
    },
    view: {
        type: String,
        optional: true,
        defaultValue: views.LOBBY,
        autoValue: function(data) {
            if (this.isUpdate && get(data, '$set.gameId')) {
                return views.LOBBY;
            }
        },
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
    isConnected: 1,
    stats: 1,
    view: 1,
};

Players.attachSchema(Players.schema);
