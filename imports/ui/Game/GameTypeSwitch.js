import React, { useState, useMemo } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { Games } from '/imports/api/games';
import { useGameContext } from '/imports/ui/core/context';
import { teams } from '/utils/constants';

export const GameTypeSwitch = () => {
    const { game, playersInGame } = useGameContext();
    const canSwitchToSingle = useMemo(() => !playersInGame.some((p) => p.team === teams.RED), [
        playersInGame,
    ]);

    const onChange = () => {
        console.log('wtf');
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
                disabled={!game.isSingleTeam && !canSwitchToSingle}
            />
        </FormGroup>
    );
};
