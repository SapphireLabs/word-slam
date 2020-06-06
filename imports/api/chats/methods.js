import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { statuses, views } from '/utils/constants';

import { Chats } from './collection';
import { Players, updateStats } from '../players';
import { add as addRound, Rounds } from '../rounds';
import { Games } from '../games';

export const add = new ValidatedMethod({
    name: 'Chats.add',
    validate: new SimpleSchema({
        message: {
            type: String,
        },
        gameId: {
            type: String,
        },
        playerId: {
            type: String,
        },
    }).validator(),
    run: ({ gameId, playerId, message }) => {
        console.log('Method - Chats.add / run', playerId);

        const response = {
            success: false,
            message: 'There was some server error.',
            isRoundComplete: false,
        };

        const player = Players.findOne({ _id: playerId });
        const game = Games.findOne({ _id: gameId });
        // save player details in chat object so we have it even if player leaves game
        const _id = Chats.insert({
            message,
            gameId,
            playerId,
            name: player.name,
            team: player.team,
        });

        const currentRound = Rounds.findOne({ gameId, status: statuses.IN_PROGRESS });

        if (currentRound) {
            console.log('Method - Chats.add / guess');
            const { word } = currentRound;

            if (!player.isStoryteller && player.team && word.length === message.length) {
                if (word.match(new RegExp(message, 'i'))) {
                    updateStats(game, player, currentRound);
                    Chats.insert({
                        gameId,
                        message: `${player.name} has guessed the word!`,
                    });
                    Rounds.update(
                        { _id: currentRound._id },
                        {
                            $set: {
                                status: statuses.COMPLETED,
                                winnerId: playerId,
                                winnerTeam: player.team,
                                isSingleTeam: game.isSingleTeam,
                            },
                        }
                    );

                    // add next round
                    addRound.call({ gameId });
                    Games.update(
                        { _id: gameId },
                        {
                            $set: {
                                status: 'WAITING',
                            },
                        }
                    );
                    // move players to results screen
                    Players.update({ gameId }, { $set: { view: views.RESULTS } }, { multi: true });
                    response.isRoundComplete = true;
                }
            }
        }

        if (_id) {
            response.success = true;
            response.message = 'Chat added.';
            response.gameId = _id;
        }

        return response;
    },
});
