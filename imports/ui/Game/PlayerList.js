import React from 'react';
import T from 'prop-types';
import { get } from 'lodash';
import { Tooltip } from '@material-ui/core';

import { views } from '/utils';

const renderPlayerStats = ({ player, isSingleTeam }) => {
    const {
        singleRoundsPlayed = 0,
        singleRoundsWon = 0,
        singleRoundsAsStoryteller = 0,
        teamRoundsPlayed = 0,
        teamRoundsWon = 0,
        teamRoundsAsStoryteller = 0,
        teamRoundsWonAsStoryteller = 0,
        totGuessSecs = 0,
        totStorytellerSecs = 0,
        wordsGuessed = 0,
    } = get(player, 'stats', {});

    return (
        <div key={`stats-${player._id}`}>
            <p>{isSingleTeam ? 'Single player stats' : 'Team stats'}</p>
            <ul>
                {isSingleTeam ? (
                    <>
                        <li>Rounds won: {singleRoundsWon}</li>
                        <li>Rounds played: {singleRoundsPlayed}</li>
                        <li>Rounds as storyteller: {singleRoundsAsStoryteller}</li>
                    </>
                ) : (
                    <>
                        <li>Rounds won: {teamRoundsWon}</li>
                        <li>Rounds played: {teamRoundsPlayed}</li>
                        <li>Rounds as storyteller: {teamRoundsAsStoryteller}</li>
                        <li>Rounds won as storyteller: {teamRoundsWonAsStoryteller}</li>
                    </>
                )}
                <li>
                    Average time to tell story:{' '}
                    {Math.round(
                        (totStorytellerSecs /
                            (singleRoundsAsStoryteller + teamRoundsAsStoryteller)) *
                            100
                    ) / 100 || 'N/A'}
                </li>
                <li>Words guessed: {wordsGuessed}</li>
                <li>
                    Average time to guess:{' '}
                    {Math.round((totGuessSecs / wordsGuessed) * 100) / 100 || 'N/A'}
                </li>
            </ul>
        </div>
    );
};

export const PlayerList = ({ playerClass, players, game, type }) => {
    return (
        <>
            {players.map((player) => {
                return (
                    <Tooltip
                        key={`${player._id}`}
                        title={renderPlayerStats({ player, isSingleTeam: game.isSingleTeam })}
                    >
                        <div className={playerClass}>
                            {player.name}
                            {!player.isConnected ? ' (Disconnected)' : ''}
                            {player.isConnected && player.view === views.RESULTS
                                ? ' (Viewing results)'
                                : ''}
                        </div>
                    </Tooltip>
                );
            })}
        </>
    );
};

PlayerList.propTypes = {
    playerClass: T.string,
    players: T.array.isRequired,
    type: T.string.isRequired,
};
