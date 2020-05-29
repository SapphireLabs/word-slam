import React, { useMemo } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import { Players } from '/imports/api/players';
import { Games } from '/imports/api/games';
import { useStyles } from '/imports/ui/core/hooks';

export const Lobby = ({ game, player, players }) => {
    const classes = useStyles();
    const { storyTeller, guessers, spectators } = useMemo(
        () =>
            players.reduce(
                (res, p) => {
                    if (!p.team) {
                        res.spectators.push(p);

                        return res;
                    }
                    if (p.isStoryteller) {
                        res.storyTeller = p;
                    } else {
                        res.guessers.push(p);
                    }

                    return res;
                },
                { guessers: [], spectators: [] }
            ),
        [players]
    );

    const onClickStoryteller = () => {
        if (!storyTeller) {
            Players.update({ _id: player._id }, { $set: { isStoryteller: true, team: 'B' } });
        }
    };

    const onClickGuesser = () => {
        Players.update({ _id: player._id }, { $set: { isStoryteller: false, team: 'B' } });
    };

    const onClickSpectator = () => {
        Players.update({ _id: player._id }, { $set: { isStoryteller: false, team: null } });
    };

    const onClickStart = () => {
        Games.update({ _id: game._id }, { $set: { status: 'IN_PROGRESS' } });
    };

    return (
        <div className={classes.containerCenter}>
            <h3 className={classNames(classes.containerCenter, classes.flexRow)}>
                Game: {game.accessCode}
                <div
                    className={classNames(classes.pointer, classes.marginLeft8)}
                    onClick={() => copy(location.href.replace('game', 'join'))}
                    title="Copy join game link"
                >
                    <FileCopyOutlinedIcon />
                </div>
            </h3>
            <h3 className={classNames(classes.containerCenter, classes.grey)}>{game.status}</h3>
            <div
                className={classNames(classes.player, classes.header, classes.pointer)}
                onClick={onClickStoryteller}
            >
                Storyteller
            </div>
            {storyTeller ? (
                <div className={classes.player}>{storyTeller.name}</div>
            ) : (
                <div>need a storyteller</div>
            )}
            <div
                className={classNames(classes.player, classes.header, classes.pointer)}
                onClick={onClickGuesser}
            >
                Guessers
            </div>
            {guessers.map((p, i) => (
                <div key={`guesser-${i}`} className={classes.player}>
                    {p.name}
                </div>
            ))}
            <div
                className={classNames(classes.player, classes.header, classes.pointer)}
                onClick={onClickSpectator}
            >
                Spectators
            </div>
            {spectators.map((p, i) => (
                <div key={`spectator-${i}`} className={classes.player}>
                    {p.name}
                </div>
            ))}
            {player.isStoryteller && (
                <button disabled={!guessers.length} onClick={onClickStart}>
                    Start
                </button>
            )}
        </div>
    );
};

Lobby.propTypes = {
    game: T.object.isRequired,
    player: T.object.isRequired,
    players: T.arrayOf(T.object),
};
