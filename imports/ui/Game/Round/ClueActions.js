import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

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

    const onClickDelete = () => {
        Rounds.update(
            { _id: round._id },
            { $set: { [`clues.${currentPlayer.team}.${idx}`]: null } }
        );
    };

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
            <ErrorOutlineIcon
                className={classes.pointer}
                onClick={onClickImportant}
                fontSize="small"
            />
            <AutorenewIcon className={classes.pointer} onClick={onClickFlip} fontSize="small" />
            <DeleteIcon className={classes.pointer} onClick={onClickDelete} fontSize="small" />
        </div>
    );
};
