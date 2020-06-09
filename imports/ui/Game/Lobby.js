import React, { useMemo } from 'react';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { Button, Tooltip } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import { Games } from '/imports/api/games';
import { Rounds } from '/imports/api/rounds';
import { useStyles } from '/imports/ui/core/hooks';
import { useGameContext } from '/imports/ui/core/context';
import { playerTypes, teams, statuses, views } from '/utils/constants';

import { StorySelect } from './StorySelect';
import { PlayerList } from './PlayerList';
import { GameTypeSwitch } from './GameTypeSwitch';
import { Team } from './Team';

const renderGameStatusMessages = (messages) => (
    <ul>
        {messages.map((message, i) => (
            <li key={`message-${i}`}>{message}</li>
        ))}
    </ul>
);

export const Lobby = () => {
    const classes = useStyles();
    const { game, currentPlayer, currentRound, playersInGame } = useGameContext();
    const unassigned = useMemo(() => playersInGame.filter((p) => !p.team), [playersInGame]);
    const gameStatusMessages = useMemo(() => {
        const messages = [];
        if (!currentPlayer.isStoryteller) {
            messages.push('The storyteller starts the round');
        }
        if (!playersInGame.some((p) => p.team === teams.BLUE && p.isStoryteller)) {
            messages.push('Blue team needs a storyteller');
        }
        if (!playersInGame.some((p) => p.team === teams.BLUE && !p.isStoryteller)) {
            messages.push('Blue team needs players');
        }
        if (game.isSingleTeam) {
            return messages;
        }
        if (!playersInGame.some((p) => p.team === teams.RED && !p.isStoryteller)) {
            messages.push('Red team needs players');
        }
        if (!playersInGame.some((p) => p.team === teams.RED && p.isStoryteller)) {
            messages.push('Red team needs a storyteller');
        }
        if (playersInGame.some((p) => p.view === views.RESULTS)) {
            messages.push('There are still players viewing the results screen.');
        }

        return messages;
    }, [game.isSingleTeam, playersInGame]);

    const onClickStart = () => {
        Games.update({ _id: game._id }, { $set: { status: statuses.IN_PROGRESS } });
        Rounds.update({ _id: currentRound._id }, { $set: { status: statuses.IN_PROGRESS } });
    };

    return (
        <div className={classes.containerCenter}>
            <h3 className={classNames(classes.containerCenter, classes.flexRow)}>
                Game: {game.accessCode}
                <div
                    className={classNames(classes.pointer, classes.marginLeft8)}
                    onClick={() => copy(location.href)}
                    title="Copy join game link"
                >
                    <FileCopyOutlinedIcon />
                </div>
            </h3>
            <GameTypeSwitch />

            {currentPlayer.isStoryteller && <StorySelect />}

            {!!unassigned.length && (
                <>
                    <div className={classNames(classes.player, classes.header, classes.pointer)}>
                        Unassigned
                    </div>
                    <PlayerList
                        players={unassigned}
                        type={playerTypes.UNASSIGNED}
                        playerClass={classes.player}
                        game={game}
                    />
                </>
            )}

            <Team team={teams.BLUE} />
            {!game.isSingleTeam && <Team team={teams.RED} />}

            <Tooltip
                title={
                    gameStatusMessages.length ? renderGameStatusMessages(gameStatusMessages) : ''
                }
            >
                <div>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={onClickStart}
                        disabled={!!gameStatusMessages.length}
                    >
                        Start
                    </Button>
                </div>
            </Tooltip>
        </div>
    );
};
