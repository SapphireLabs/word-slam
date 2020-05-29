import React from 'react';
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

export const Round = ({ game, player, players }) => {
    const roundClasses = useRoundStyles();

    return (
        <div>
            BOARD GRID HERE
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
        </div>
    );
};

Round.propTypes = {
    game: T.object.isRequired,
    player: T.object.isRequired,
    players: T.arrayOf(T.object),
};
