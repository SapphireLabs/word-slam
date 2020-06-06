import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { get } from 'lodash';

import { statuses } from '/utils/constants';

import { getCategory } from './methods';

export const Rounds = new Mongo.Collection('rounds');

const clueType = new SimpleSchema({
    label: {
        type: String,
    },
    category: {
        type: String,
    },
});

const clueListType = new SimpleSchema({
    Blue: {
        type: Array,
        defaultValue: new Array(8).fill(null),
    },
    'Blue.$': {
        type: clueType,
    },
    Red: {
        type: Array,
        defaultValue: new Array(8).fill(null),
    },
    'Red.$': {
        type: clueType,
    },
});

Rounds.schema = new SimpleSchema({
    gameId: {
        type: String,
    },
    word: {
        type: String,
    },
    hiddenWord: {
        type: Array,
        autoValue: function(data) {
            // when creating a new round, or generating a new word
            if (
                this.isInsert ||
                (this.isUpdate && get(data, '$set.word') && !get(data, '$set.hiddenWord'))
            ) {
                return (get(data, 'word') || get(data, '$set.word'))
                    .split('')
                    .map((c) => !c.match(/[a-z0-9]/i));
            }
        },
    },
    'hiddenWord.$': {
        type: Boolean,
    },
    category: {
        type: Object,
        autoValue: function(data) {
            // when inserting initially, or choosing the random option, replace
            // this value with the "true category" instead of random
            if (
                this.isInsert ||
                (this.isUpdate &&
                    get(data, '$set.word') &&
                    get(data, '$set.category.value') !== 'Random')
            ) {
                return {
                    label: getCategory(get(data, 'word', get(data, '$set.word'))),
                    value: 'Random',
                };
            }
        },
    },
    'category.label': {
        type: String,
    },
    'category.value': {
        type: String,
    },
    team: {
        type: String,
        optional: true,
    },
    status: {
        type: String,
        defaultValue: 'WAITING',
    },
    winnerId: {
        type: String,
        optional: true,
    },
    winnerTeam: {
        type: String,
        optional: true,
    },
    isSingleTeam: {
        type: Boolean,
        optional: true,
    },
    clues: {
        type: clueListType,
        defaultValue: {},
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
    startedAt: {
        type: Date,
        autoValue: function(data) {
            if (this.isUpdate && get(data, '$set.status') === statuses.IN_PROGRESS) {
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
    word: 1,
    hiddenWord: 1,
    category: 1,
    status: 1,
    winnerId: 1,
    winnerTeam: 1,
    clues: 1,
    updatedAt: 1,
    startedAt: 1,
};

Rounds.attachSchema(Rounds.schema);
