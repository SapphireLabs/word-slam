import React, { useMemo } from 'react';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { Button } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import { Players } from '/imports/api/players';
import { Games } from '/imports/api/games';
import { Rounds } from '/imports/api/rounds';
import { useStyles, useStoryWord } from '/imports/ui/core/hooks';
import { useGameContext } from '/imports/ui/core/context';
import { playerTypes } from '/utils/constants';

import { StorySelect } from './StorySelect';
import { PlayerList } from './PlayerList';

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
    const { game, currentPlayer, playersInGame } = useGameContext();
    const wordProps = useStoryWord();

    // filter players into their roles
    const { storyTellers, players, unassigned } = useMemo(
        () =>
            playersInGame.reduce(
                (res, p) => {
                    if (!p.team) {
                        res.unassigned.push(p);

                        return res;
                    }
                    if (p.isStoryteller) {
                        res.storyTellers.push(p);
                    } else {
                        res.players.push(p);
                    }

                    return res;
                },
                { storyTellers: [], players: [], unassigned: [] }
            ),
        [playersInGame]
    );

    const onClickStoryteller = () => {
        Players.update({ _id: currentPlayer._id }, { $set: { isStoryteller: true, team: 'B' } });
    };

    const onClickPlayer = () => {
        Players.update({ _id: currentPlayer._id }, { $set: { isStoryteller: false, team: 'B' } });
    };

    const onClickStart = () => {
        Rounds.insert({
            gameId: game._id,
            word: wordProps.word,
            category: wordProps.trueCategory.label,
        });
        Games.update({ _id: game._id }, { $set: { status: 'IN_PROGRESS' } });
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

            {currentPlayer.isStoryteller && <StorySelect {...wordProps} />}

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

            <div
                className={classNames(classes.player, classes.header, classes.pointer)}
                onClick={onClickStoryteller}
            >
                Storyteller
            </div>
            <PlayerList
                players={storyTellers}
                type={playerTypes.STORYTELLER}
                playerClass={classes.player}
            />

            <div
                className={classNames(classes.player, classes.header, classes.pointer)}
                onClick={onClickPlayer}
            >
                Players
            </div>
            <PlayerList players={players} type={playerTypes.PLAYER} playerClass={classes.player} />

            {currentPlayer.isStoryteller && (
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    disabled={!players.length}
                    onClick={onClickStart}
                >
                    Start
                </Button>
            )}
        </div>
    );
};
