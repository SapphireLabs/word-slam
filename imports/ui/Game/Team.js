import React, { useMemo } from 'react';
import T from 'prop-types';
import classNames from 'classnames';

import { Players } from '/imports/api/players';
import { useStyles } from '/imports/ui/core/hooks';
import { useGameContext } from '/imports/ui/core/context';
import { generateWord } from '/utils/game';
import { playerTypes, teams } from '/utils/constants';

import { PlayerList } from './PlayerList';

export const Team = ({ team }) => {
    const classes = useStyles();
    const { currentPlayer, playersInGame, currentRound, game } = useGameContext();
    const hasStoryteller = useMemo(
        () => playersInGame.some((p) => p.isStoryteller && p.team === team),
        [playersInGame]
    );

    const onClickStoryteller = () => {
        Players.update({ _id: currentPlayer._id }, { $set: { isStoryteller: true, team } });
        generateWord(currentRound);
    };

    const onClickPlayer = () => {
        Players.update({ _id: currentPlayer._id }, { $set: { isStoryteller: false, team } });
    };

    // filter players into their roles
    const { storyTellers, players } = useMemo(
        () =>
            playersInGame
                .filter((p) => p.team === team)
                .reduce(
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
                    { storyTellers: [], players: [] }
                ),
        [playersInGame]
    );

    return (
        <>
            <h3>{team} team</h3>
            <div
                className={classNames(classes.player, classes.header, {
                    [classes.pointer]: !hasStoryteller,
                })}
                onClick={hasStoryteller ? null : onClickStoryteller}
            >
                Storyteller
            </div>
            <PlayerList
                players={storyTellers}
                type={playerTypes.STORYTELLER}
                playerClass={classes.player}
                game={game}
            />

            <div
                className={classNames(classes.player, classes.header, classes.pointer)}
                onClick={onClickPlayer}
            >
                Players
            </div>
            <PlayerList
                players={players}
                type={playerTypes.PLAYER}
                playerClass={classes.player}
                game={game}
            />
        </>
    );
};

Team.propTypes = {
    team: T.oneOf(Object.values(teams)),
};
