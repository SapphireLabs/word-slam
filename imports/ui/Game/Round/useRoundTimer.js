import { Meteor } from 'meteor/meteor';
import { useEffect } from 'react';

import { add as addRound, Rounds } from '/imports/api/rounds';
import { Chats } from '/imports/api/chats';
import { Games } from '/imports/api/games';
import { updateStats } from '/imports/api/players';
import { useGameContext } from '/imports/ui/core/context';
import { statuses } from '/utils';

export const useRoundTimer = () => {
    const { currentPlayer, currentRound, game } = useGameContext();

    // Show new letter every 10 seconds
    useEffect(() => {
        let interval;
        if (
            currentRound &&
            currentPlayer.isStoryteller &&
            currentRound.status === statuses.IN_PROGRESS
        ) {
            clearInterval(interval);
            interval = setInterval(() => {
                const hidden = currentRound.hiddenWord.reduce((acc, show, i) => {
                    if (!show) {
                        acc.push(i);
                    }

                    return acc;
                }, []);

                if (hidden.length === 1) {
                    // end round
                    // TODO: use new game end stuff
                    updateStats(game, currentPlayer, currentRound, false);
                    Rounds.update(
                        { _id: currentRound._id },
                        { $set: { [`hiddenWord.${hidden[0]}`]: true, status: 'COMPLETED' } }
                    );
                    Chats.insert({
                        gameId: game._id,
                        message: 'Nobody was able to guess the word.',
                    });
                    Meteor.setTimeout(() => {
                        addRound.call({ gameId: game._id });
                        Games.update(
                            { _id: game._id },
                            {
                                $set: {
                                    status: 'WAITING',
                                },
                            }
                        );
                    }, 5000);
                }

                const revealIdx = hidden[Math.floor(Math.random() * hidden.length)];
                // reveal a letter
                Rounds.update(
                    { _id: currentRound._id },
                    { $set: { [`hiddenWord.${revealIdx}`]: true } }
                );
            }, 10000);
        }

        return () => clearInterval(interval);
    }, [currentRound]);
};
