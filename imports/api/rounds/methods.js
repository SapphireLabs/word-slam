import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Chats, Games, Players, updateStats } from '/imports/api';
import { stories } from '/utils/fixtures';
import { DEFAULT_RESPONSE, statuses, views } from '/utils/constants';

import { Rounds } from './collection';

const allWords = Object.keys(stories).reduce((acc, category) => [...acc, ...stories[category]], []);
export const getCategory = (word) =>
    Object.keys(stories).find((category) => stories[category].includes(word));
const getWordBank = (category) =>
    !category || category.value === 'Random' ? allWords : stories[category.value];
export const generateWord = (category) => {
    const wordBank = getWordBank(category);
    return wordBank[Math.floor(Math.random() * wordBank.length)];
};

export const add = new ValidatedMethod({
    name: 'Rounds.add',
    validate: new SimpleSchema({
        gameId: {
            type: String,
        },
    }).validator(),
    run: ({ gameId }) => {
        console.log('Method - Rounds.add / run', gameId);

        const response = {
            success: false,
            message: 'There was some server error.',
        };
        const word = generateWord();

        const roundId = Rounds.insert({ gameId, word });

        if (roundId) {
            response.success = true;
            response.message = 'Round added.';
            response.roundId = roundId;
        }

        return response;
    },
});

export const updateWord = new ValidatedMethod({
    name: 'Rounds.updateWord',
    validate: new SimpleSchema({
        _id: {
            type: String,
        },
        category: {
            type: Object,
            optional: true,
        },
        'category.label': {
            type: String,
        },
        'category.value': {
            type: String,
        },
        word: {
            type: String,
        },
    }).validator(),
    run: ({ _id, category, word }) => {
        console.log('Method - Rounds.updateWord / run', _id);

        const response = {
            success: false,
            message: 'There was some server error.',
        };

        const roundId = Rounds.update({ _id }, { $set: { word, category } });

        if (roundId) {
            response.success = true;
            response.message = 'Round word updated.';
        }

        return response;
    },
});

export const endRound = new ValidatedMethod({
    name: 'Rounds.endRound',
    validate: new SimpleSchema({
        _id: {
            type: String,
        },
        isGuessed: {
            type: Boolean,
            optional: true,
        },
        playerId: {
            type: String,
        },
    }).validator(),
    run: ({ _id, isGuessed = true, playerId }) => {
        console.log('Method - Rounds.endRound / run', _id);
        const response = { ...DEFAULT_RESPONSE };
        const round = Rounds.findOne({ _id });
        const game = Games.findOne({ _id: round.gameId });
        const player = Players.findOne({ _id: playerId });
        const roundUpdateObj = {
            status: statuses.COMPLETED,
            isSingleTeam: game.isSingleTeam,
        };

        updateStats(game, player, round, isGuessed);

        if (isGuessed) {
            Chats.insert({
                gameId: round.gameId,
                message: `${player.name} has guessed the word!`,
            });
            roundUpdateObj.winnerId = player._id;
            roundUpdateObj.winnerTeam = player.team;
        } else {
            Chats.insert({
                gameId: round.gameId,
                message: 'Nobody was able to guess the word.',
            });
        }

        const updated = Rounds.update({ _id }, { $set: roundUpdateObj });

        // add next round
        add.call({ gameId: round.gameId });
        Games.update({ _id: round.gameId }, { $set: { status: 'WAITING' } });

        // move players to results screen
        Players.update(
            { gameId: round.gameId },
            { $set: { view: views.RESULTS } },
            { multi: true }
        );

        if (updated) {
            response.success = true;
            response.message = 'Round ended.';
        }

        return response;
    },
});
