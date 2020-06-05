import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { getCategory } from './methods';

export const Rounds = new Mongo.Collection('rounds');

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
            if (this.isInsert || (this.isUpdate && data.word && !data.hiddenWord)) {
                return data.word.split('').map((c) => !c.match(/[a-z0-9]/i));
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
            if (this.isInsert || (this.isUpdate && data.word && data.category.value === 'Random')) {
                return {
                    label: getCategory(data.word),
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
        defaultValue: 'IN_PROGRESS',
    },
    winnerId: {
        type: String,
        optional: true,
    },
    clues: {
        type: Array,
        defaultValue: new Array(8).fill(null),
    },
    'clues.$': {
        type: Object,
    },
    'clues.$.label': {
        type: String,
    },
    'clues.$.category': {
        type: String,
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
    word: 1,
    hiddenWord: 1,
    category: 1,
    status: 1,
    winnerId: 1,
    clues: 1,
    updatedAt: 1,
};

Rounds.attachSchema(Rounds.schema);
