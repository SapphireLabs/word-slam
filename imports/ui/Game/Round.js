import React, { useMemo, useState, useEffect } from 'react';
import T from 'prop-types';
import { get } from 'lodash';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

import { clues } from '/utils/fixtures';
import { ClueSelect } from './ClueSelect';
import { Board } from './Board';

export const useRoundStyles = makeStyles((_) => ({
    clueContainer: {
        display: 'flex',
    },
    clueSelect: {
        flex: 1,
        margin: 8,
    },
}));

export const Round = ({ game, player, players, rounds = [] }) => {
    let [timer, setTimer] = useState(5);
    const roundClasses = useRoundStyles();
    const currentRound = useMemo(() => rounds.find((r) => r.status === 'IN_PROGRESS'), [rounds]);
    const latestRound = useMemo(
        () => rounds.reduce((max, r) => (!max || r.updatedAt > max.updatedAt ? r : max), null),
        [rounds]
    );

    useEffect(() => {
        let interval;
        if (!currentRound && latestRound) {
            interval = setInterval(() => {
                setTimer(5 - moment().diff(moment(latestRound.updatedAt), 'seconds'));
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [currentRound, latestRound]);

    return (
        <div>
            {currentRound && (
                <>
                    <h2>Category: {currentRound.category}</h2>
                    <h2>Story word: {player.isStoryteller ? currentRound.word : '?'}</h2>
                    <Board round={currentRound} />
                    {player.isStoryteller && (
                        <>
                            <h3>Clues</h3>
                            <div className={roundClasses.clueContainer}>
                                {Object.keys(clues).map((type) => (
                                    <ClueSelect
                                        className={roundClasses.clueSelect}
                                        key={`ClueSelect-${type}`}
                                        type={type}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
            {!currentRound && latestRound && (
                <>
                    <h2>The word was: {get(latestRound, 'word')}</h2>
                    <h2>Returning to lobby in {timer}...</h2>
                </>
            )}
        </div>
    );
};

Round.propTypes = {
    game: T.object.isRequired,
    player: T.object.isRequired,
    players: T.arrayOf(T.object),
    rounds: T.array,
};
