import { useEffect } from 'react';
import { get } from 'lodash';

import { endRound, Rounds } from '/imports/api/rounds';
import { useGameContext } from '/imports/ui/core/context';
import { statuses, teams } from '/utils';

/**
 * Reveals a letter based on game hint timer setting, ends the round if last letter is revealed
 */
export const useRoundTimer = () => {
    const { currentPlayer, currentRound, game } = useGameContext();

    // Show new letter every 10 seconds
    useEffect(() => {
        let interval;
        if (
            !interval &&
            currentRound &&
            currentPlayer.isStoryteller &&
            currentPlayer.team === teams.BLUE &&
            currentRound.status === statuses.IN_PROGRESS &&
            game.showHint
        ) {
            interval = setInterval(() => {
                const round = Rounds.findOne({ _id: currentRound._id });
                const hidden = round.hiddenWord.reduce((acc, show, i) => {
                    if (!show) {
                        acc.push(i);
                    }

                    return acc;
                }, []);

                if (hidden.length <= 1) {
                    // nobody guessed successfully, end round
                    endRound.call({
                        _id: currentRound._id,
                        playerId: currentPlayer._id,
                        isGuessed: false,
                    });
                    clearInterval(interval);
                    return;
                }

                const revealIdx = hidden[Math.floor(Math.random() * hidden.length)];
                // reveal a letter
                Rounds.update(
                    { _id: currentRound._id },
                    { $set: { [`hiddenWord.${revealIdx}`]: true } }
                );
            }, game.showHint * 1000);
        }

        return () => clearInterval(interval);
    }, [currentRound.status]);
};
