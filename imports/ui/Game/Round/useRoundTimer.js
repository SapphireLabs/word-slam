import { Meteor } from 'meteor/meteor';
import { useEffect, useState, useMemo } from 'react';
import moment from 'moment';

import { Rounds } from '/imports/api/rounds';
import { Chats } from '/imports/api/chats';
import { Games } from '/imports/api/games';
import { useGameContext } from '/imports/ui/core/context';
import { statuses } from '/utils/constants';

export const useRoundTimer = () => {
    const { currentPlayer, currentRound, game, rounds } = useGameContext;
    let [timer, setTimer] = useState(5);
    const latestRound = useMemo(
        () =>
            rounds
                .filter((r) => r.status === statuses.COMPLETED)
                .reduce((max, r) => (r.updatedAt > max.updatedAt ? r : max)),
        [rounds]
    );

    // Show new letter every 10 seconds
    useEffect(() => {
        let interval;
        if (currentPlayer.isStoryteller && currentRound && currentRound.hiddenWord) {
            interval = setInterval(() => {
                const hidden = currentRound.hiddenWord.reduce((acc, show, i) => {
                    if (!show) {
                        acc.push(i);
                    }

                    return acc;
                }, []);

                if (hidden.length === 1) {
                    // end round
                    Rounds.update(
                        { _id: currentRound._id },
                        { $set: { [`hiddenWord.${hidden[0]}`]: true, status: 'COMPLETED' } }
                    );
                    Chats.insert({
                        gameId: game._id,
                        message: 'Nobody was able to guess the word.',
                    });
                    Meteor.setTimeout(() => {
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

    // show round timer for next round
    useEffect(() => {
        let interval;
        if (!currentRound && latestRound) {
            interval = setInterval(() => {
                setTimer(5 - moment().diff(moment(latestRound.updatedAt), 'seconds'));
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [currentRound, latestRound]);

    return { timer };
};
