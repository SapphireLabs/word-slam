import React, { useMemo } from 'react';
import { get, last } from 'lodash';
import Button from '@material-ui/core/Button';

import { Players } from '/imports/api';
import { useGameContext } from '/imports/ui/core';
import { statuses, views } from '/utils';

const buildWordList = (clues) =>
    clues
        .filter((c) => !!c)
        .map((c) => c.label)
        .join(', ');

const TeamResults = ({ latestRound, score }) => {
    return (
        <div>
            {latestRound.winnerTeam ? (
                <>
                    <h3>{latestRound.winnerTeam} team won the round!</h3>
                    <h5>Clues given (Blue): {buildWordList(latestRound.clues.Blue)}</h5>
                    <h5>Clues given (Red): {buildWordList(latestRound.clues.Red)}</h5>
                </>
            ) : (
                <h3>No one guessed the word...</h3>
            )}
            <h4>Blue: {score.Blue}</h4>
            <h4>Red: {score.Red}</h4>
        </div>
    );
};

export const Results = () => {
    const { currentPlayer, rounds, score } = useGameContext();
    const latestRound = useMemo(() => last(rounds.filter((r) => r.status === statuses.COMPLETED)), [
        rounds,
    ]);

    const onClickReturn = () => {
        Players.update({ _id: currentPlayer._id }, { $set: { view: views.LOBBY } });
    };

    return (
        <>
            <h2>The word was: {get(latestRound, 'word')}</h2>
            {!get(latestRound, 'isSingleTeam') && (
                <TeamResults latestRound={latestRound} score={score} />
            )}
            <Button variant="outlined" color="primary" onClick={onClickReturn}>
                Return to Lobby
            </Button>
        </>
    );
};
