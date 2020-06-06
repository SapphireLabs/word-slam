import React, { useState, useMemo } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { Games } from '/imports/api/games';
import { useGameContext } from '/imports/ui/core/context';
import { teams } from '/utils/constants';

export const GameTypeSwitch = () => {
    const { game, playersInGame } = useGameContext();
    const disabled = useMemo(
        () => !game.isSingleTeam && playersInGame.some((p) => p.team === teams.RED),
        [game.isSingleTeam, playersInGame]
    );

    const onChange = () => {
        Games.update({ _id: game._id }, { $set: { isSingleTeam: !game.isSingleTeam } });
    };

    return (
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
                title={disabled ? 'Cannot switch to single team game if there are Red players' : ''}
            />
        </FormGroup>
    );
};
