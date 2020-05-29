import React, { useMemo } from 'react';
import T from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { clues } from '/utils/fixtures';
import { ClueSelect } from './ClueSelect';

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
    const roundClasses = useRoundStyles();
    const currentRound = useMemo(() => rounds.find((r) => r.status === 'IN_PROGRESS'), [rounds]);

    return (
        <div>
            {currentRound && (
                <>
                    <h2>Category: {currentRound.category}</h2>
                    <h2>Story word: {player.isStoryteller ? currentRound.word : '?'}</h2>
                    <div>GRID</div>
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
        </div>
    );
};

Round.propTypes = {
    game: T.object.isRequired,
    player: T.object.isRequired,
    players: T.arrayOf(T.object),
    rounds: T.array,
};
