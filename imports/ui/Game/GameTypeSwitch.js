import React, { useMemo } from 'react';
import { FormGroup, FormControlLabel, Switch, TextField } from '@material-ui/core';

import { Games } from '/imports/api/games';
import { useGameContext } from '/imports/ui/core/context';
import { teams } from '/utils/constants';

export const GameTypeSwitch = () => {
    const { game, playersInGame, currentPlayer } = useGameContext();
    const disabled = useMemo(
        () => !game.isSingleTeam && playersInGame.some((p) => p.team === teams.RED),
        [game.isSingleTeam, playersInGame]
    );

    const onChange = () => {
        Games.update({ _id: game._id }, { $set: { isSingleTeam: !game.isSingleTeam } });
    };

    const onChangeHintTimer = (e) => {
        const val = e.target.value;
        if (!isNaN(val) && val >= 0 && val <= 30) {
            Games.update({ _id: game._id }, { $set: { showHint: e.target.value } });
        }
    };

    return (
        <>
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Switch
                            checked={!game.isSingleTeam}
                            onChange={onChange}
                            name="game-type-switch"
                            color="primary"
                        />
                    }
                    label="Team versus"
                    disabled={disabled}
                    title={
                        disabled ? 'Cannot switch to single team game if there are Red players' : ''
                    }
                />
            </FormGroup>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                Show hints every
                <TextField
                    style={{ margin: '0 4px' }}
                    id="hint-number-input"
                    title="Set to 0 to turn hints off."
                    type="number"
                    placeholder="0-30"
                    value={game.showHint || 0}
                    onChange={onChangeHintTimer}
                    disabled={!currentPlayer.isStoryteller}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        min: 0,
                        max: 30,
                        step: 5,
                    }}
                />
                seconds.
            </div>
        </>
    );
};
