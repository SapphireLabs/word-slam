import React, { useMemo } from 'react';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { Button } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import { Games } from '/imports/api/games';
import { useStyles } from '/imports/ui/core/hooks';
import { useGameContext } from '/imports/ui/core/context';
import { playerTypes, teams, statuses } from '/utils/constants';

import { StorySelect } from './StorySelect';
import { PlayerList } from './PlayerList';
import { GameTypeSwitch } from './GameTypeSwitch';
import { Team } from './Team';

const Status = ({ game, currentPlayer }) => {
    const classes = useStyles();

    return (
        <div className={classNames(classes.containerCenter, classes.grey)}>
            {currentPlayer.isStoryteller ? (
                <>
                    <h3>You're the storyteller!</h3>
                    <h5>Pick a category and story word and then start the round.</h5>
                </>
            ) : (
                <h3>{game.status}</h3>
            )}
        </div>
    );
};

export const Lobby = () => {
    const classes = useStyles();
    const { game, currentPlayer, playersInGame, currentRound } = useGameContext();
    const unassigned = useMemo(() => playersInGame.filter((p) => !p.team), [playersInGame]);
    const gameStatusMessages = useMemo(() => {
        const messages = [];
        if (!playersInGame.some((p) => p.team === teams.BLUE && !p.isStoryteller)) {
            messages.push('Blue team needs players');
        }
        if (game.isSingleTeam) {
            return messages;
        }
        if (!playersInGame.some((p) => p.team === teams.RED && !p.isStoryteller)) {
            messages.push('Red team needs players');
        }
        if (!playersInGame.some((p) => p.team === teams.BLUE && p.isStoryteller)) {
            messages.push('Blue team needs a storyteller');
        }
        if (!playersInGame.some((p) => p.team === teams.RED && p.isStoryteller)) {
            messages.push('Red team needs a storyteller');
        }

        return messages;
    }, [game.isSingleTeam, playersInGame]);

    const onClickStart = () => {
        Games.update({ _id: game._id }, { $set: { status: statuses.IN_PROGRESS } });
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
            <Status game={game} currentPlayer={currentPlayer} />
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
                    />
                </>
            )}

            <Team team={teams.BLUE} />
            {!game.isSingleTeam && <Team team={teams.RED} />}

            {currentPlayer.isStoryteller && (
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={onClickStart}
                    disabled={!!gameStatusMessages.length}
                >
                    Start
                </Button>
            )}
        </div>
    );
};
