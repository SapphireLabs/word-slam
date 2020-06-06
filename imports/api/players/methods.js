import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import moment from 'moment';

import { Players } from './collection';
import { Games } from '../games';
import { Chats } from '../chats';

export const add = new ValidatedMethod({
    name: 'Players.add',
    validate: new SimpleSchema({
        _id: {
            type: String,
            optional: true,
        },
        name: {
            type: String,
        },
        gameId: {
            type: String,
        },
    }).validator(),
    run: ({ _id, name, gameId, isStoryteller = false, team = null }) => {
        console.log('Method - Players.add / run', gameId);
        const response = {
            success: false,
            message: 'There was some server error.',
        };
        const playerId = Players.upsert(
            { _id },
            {
                $set: {
                    name,
                    gameId,
                    isStoryteller,
                    team,
                },
            }
        );

        Chats.insert({
            gameId,
            message: `${name} has joined the game!`,
        });

        if (playerId) {
            response.success = true;
            response.message = 'Player added.';
            response.playerId = playerId.insertedId;
        }

        return response;
    },
});

/**
 * Removes a player from a game. Deletes the game if empty.
 */
export const remove = new ValidatedMethod({
    name: 'Players.remove',
    validate: new SimpleSchema({
        _id: {
            type: String,
            optional: true,
        },
    }).validator(),
    run: ({ _id }) => {
        const response = {
            success: false,
            message: 'There was some server error.',
        };
        const player = Players.findOne({ _id }, { fields: Players.publicFields });

        if (player) {
            // disassociate but keep player object for stats
            Players.update({ _id }, { $set: { gameId: null } });

            const other = Players.findOne({ gameId: player.gameId });

            if (other) {
                Chats.insert({
                    gameId: player.gameId,
                    message: `${player.name} has left the game.`,
                });
            } else {
                Games.remove({ _id: player.gameId });
            }

            response.success = true;
            response.message = 'Player removed.';
        }

        return response;
    },
});

export const updateStats = (game, currentPlayer, round, guessed = true) => {
    const roundSecs = moment().diff(moment(round.startedAt), 'seconds');

    const getStoryTellerUpdate = (guessed) =>
        !game.isSingleTeam
            ? {
                  $inc: {
                      'stats.teamRoundsAsStoryteller': 1,
                      'stats.teamRoundsWonAsStoryteller': guessed ? 1 : 0,
                      'stats.totStorytellerSecs': roundSecs,
                  },
              }
            : {
                  $inc: {
                      'stats.singleRoundsAsStoryteller': 1,
                      'stats.totStorytellerSecs': roundSecs,
                  },
              };

    const getPlayerUpdate = (won, guessed) =>
        !game.isSingleTeam
            ? {
                  $inc: {
                      'stats.teamRoundsPlayed': 1,
                      'stats.teamRoundsWon': won ? 1 : 0,
                      'stats.wordsGuessed': guessed ? 1 : 0,
                      'stats.totGuessSecs': guessed ? roundSecs : 0,
                  },
              }
            : {
                  $inc: {
                      'stats.singleRoundsPlayed': 1,
                      'stats.singleRoundsWon': guessed ? 1 : 0,
                      'stats.wordsGuessed': guessed ? 1 : 0,
                      'stats.totGuessSecs': guessed ? roundSecs : 0,
                  },
              };

    // update blue team
    // update red team
    // update storyteller
    Players.update(
        {
            gameId: game._id,
            isStoryteller: true,
            team: currentPlayer.team,
        },
        getStoryTellerUpdate(guessed),
        { multi: true }
    );
    Players.update(
        {
            gameId: game._id,
            isStoryteller: true,
            team: { $ne: currentPlayer.team },
        },
        getStoryTellerUpdate(false),
        { multi: true }
    );

    // if no one guessed the word
    if (!guessed) {
        Players.update({ gameId: game._id, isStoryteller: false }, getPlayerUpdate(false, false), {
            multi: true,
        });

        return;
    }

    // update guesser
    Players.update(
        {
            gameId: game._id,
            isStoryteller: false,
            _id: currentPlayer._id,
        },
        getPlayerUpdate(true, true)
    );

    // update others on guesser team
    Players.update(
        {
            gameId: game._id,
            isStoryteller: false,
            team: currentPlayer.team,
            _id: { $ne: currentPlayer._id },
        },
        getPlayerUpdate(true, false),
        { multi: true }
    );

    if (!game.isSingleTeam) {
        // update others not on winner team
        Players.update(
            {
                gameId: game._id,
                isStoryteller: false,
                team: { $ne: currentPlayer.team },
            },
            getPlayerUpdate(false, false),
            { multi: true }
        );
    }
};
