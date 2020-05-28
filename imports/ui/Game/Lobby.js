import React, { useMemo } from 'react';
import T from 'prop-types';

import { Players } from '/imports/api/players';
import { Games } from '/imports/api/games';

export const Lobby = ({ game, player, players }) => {
    const { storyTeller, guessers } = useMemo(
        () =>
            players.reduce(
                (res, p) => {
                    if (p.isStoryteller) {
                        res.storyTeller = p;
                    } else {
                        res.guessers.push(p);
                    }

                    return res;
                },
                { guessers: [] }
            ),
        [players]
    );

    const onClickStoryteller = () => {
        if (!storyTeller) {
            Players.update({ _id: player._id }, { $set: { isStoryteller: true } });
        }
    };

    const onClickGuesser = () => {
        Players.update({ _id: player._id }, { $set: { isStoryteller: false } });
    };

    const onClickStart = () => {
        Games.update({ _id: game._id }, { $set: { status: 'IN_PROGRESS' } });
    };

    return (
        <div>
            <div>Game access code: {game.accessCode}</div>
            <div>Status: {game.status}</div>
            <div onClick={onClickStoryteller}>Storyteller:</div>
            <ul>{storyTeller ? <li>{storyTeller.name}</li> : 'need a storyteller'}</ul>
            <div onClick={onClickGuesser}>Guessers:</div>
            <ul>
                {guessers.map((p, i) => (
                    <li key={`player-${i}`}>{p.name}</li>
                ))}
            </ul>
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
