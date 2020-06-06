import React, { useMemo } from 'react';
import { get, last } from 'lodash';
import Button from '@material-ui/core/Button';

import { Players } from '/imports/api';
import { useGameContext } from '/imports/ui/core';
import { statuses, views } from '/utils';

export const Results = () => {
    const { currentPlayer, rounds } = useGameContext();
    const latestRound = useMemo(() => last(rounds.filter((r) => r.status === statuses.COMPLETED)), [
        rounds,
    ]);

    const onClickReturn = () => {
        Players.update({ _id: currentPlayer._id }, { $set: { view: views.LOBBY } });
    };

    return (
        <>
            <h2>The word was: {get(latestRound, 'word')}</h2>
            <Button variant="outlined" color="primary" onClick={onClickReturn}>
                Return to Lobby
            </Button>
        </>
    );
};
