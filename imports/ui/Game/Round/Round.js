import React from 'react';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

import { useGameContext } from '/imports/ui/core/context';
import { clues, views } from '/utils';

import { ClueSelect } from './ClueSelect';
import { Board } from './Board';
import { useRoundTimer } from './useRoundTimer';
import { Results } from '../Results';

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
    useRoundTimer();

    if (!currentRound) {
        return null;
    }

    return (
        <div>
            {currentPlayer.view === views.RESULTS ? (
                <Results />
            ) : (
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
                    <Board round={currentRound} currentPlayer={currentPlayer} />
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
        </div>
    );
};
