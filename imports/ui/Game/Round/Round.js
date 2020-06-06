import React from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

import { useGameContext } from '/imports/ui/core/context';
import { clues } from '/utils/fixtures';

import { ClueSelect } from './ClueSelect';
import { Board } from './Board';
import { useRoundTimer } from './useRoundTimer';

export const useRoundStyles = makeStyles((_) => ({
    clueContainer: {
        display: 'flex',
    },
    clueSelect: {
        flex: 1,
        margin: 8,
    },
}));

export const Round = () => {
    const roundClasses = useRoundStyles();
    const { currentPlayer, currentRound } = useGameContext();
    const { timer, latestRound } = useRoundTimer();

    return (
        <div>
            {currentRound && (
                <>
                    <h2>Category: {get(currentRound, 'category.label')}</h2>
                    <h2 style={{ whiteSpace: 'pre' }}>
                        Story word:{' '}
                        {currentPlayer.isStoryteller
                            ? currentRound.word
                            : currentRound.hiddenWord
                                  .map((show, i) => (show ? currentRound.word[i] + ' ' : '_ '))
                                  .join('')}
                    </h2>
                    <Board round={currentRound} />
                    {currentPlayer.isStoryteller && (
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
            {latestRound && (
                <>
                    <h2>The word was: {get(latestRound, 'word')}</h2>
                    <h2>Returning to lobby in {timer}...</h2>
                </>
            )}
        </div>
    );
};
