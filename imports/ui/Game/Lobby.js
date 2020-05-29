import React, { useMemo } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

import { Players } from '/imports/api/players';
import { Games } from '/imports/api/games';
import { Rounds } from '/imports/api/rounds';
import { useStyles, useStoryWord } from '/imports/ui/core/hooks';
import { StorySelect } from './StorySelect';

const Status = ({ game, player }) => {
    const classes = useStyles();

    return (
        <div className={classNames(classes.containerCenter, classes.grey)}>
            {player.isStoryteller ? (
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

export const Lobby = ({ game, player, players }) => {
    const classes = useStyles();
    const wordProps = useStoryWord();
    const { word, category } = wordProps;
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
        console.log(word);
        Rounds.insert({ gameId: game._id, word, category: category.label });
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
            <Status game={game} player={player} />
            {player.isStoryteller && <StorySelect {...wordProps} />}
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
