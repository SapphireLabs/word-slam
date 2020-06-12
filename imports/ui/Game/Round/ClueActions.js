import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Tooltip } from '@material-ui/core';

import { Rounds } from '/imports/api';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
    },
    pointer: {
        cursor: 'pointer',
    },
}));

/**
 * Actions a storyteller can take on a clue slot
 */
export const ClueActions = ({ clue, round, currentPlayer, idx }) => {
    const classes = useStyles();

    const onClickFlip = () => {
        Rounds.update(
            { _id: round._id },
            {
                $set: {
                    [`clues.${currentPlayer.team}.${idx}.orientation`]: clue.orientation ? 0 : 1,
                },
            }
        );
    };

    const onClickImportant = () => {
        Rounds.update(
            { _id: round._id },
            {
                $set: {
                    [`clues.${currentPlayer.team}.${idx}.important`]: !clue.important,
                },
            }
        );
    };

    return (
        <div className={classes.container}>
            <Tooltip title="Mark as important">
                <ErrorOutlineIcon
                    className={classes.pointer}
                    onClick={onClickImportant}
                    fontSize="small"
                />
            </Tooltip>
            <Tooltip title="Flip orientation">
                <AutorenewIcon className={classes.pointer} onClick={onClickFlip} fontSize="small" />
            </Tooltip>
        </div>
    );
};
