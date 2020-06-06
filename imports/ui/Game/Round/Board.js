import React, { useState } from 'react';
import classNames from 'classnames';
import { pick } from 'lodash';
import { useDrop } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import green from '@material-ui/core/colors/green';

import { Rounds } from '/imports/api/rounds';
import { itemTypes } from '/utils/constants';

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        marginBottom: 16,
    },
    paper: {
        padding: theme.spacing(1),
        height: 100,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    isOver: {
        backgroundColor: green[200],
    },
}));

const Slot = ({ idx, round }) => {
    const { _id, clues } = round;
    const classes = useStyles();
    const [{ isOver }, dropRef] = useDrop({
        accept: itemTypes.CLUE,
        drop: (item) => {
            Rounds.update(
                { _id },
                {
                    $set: {
                        [`clues.${idx}`]: pick(item, ['label', 'category']),
                    },
                }
            );
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <Paper ref={dropRef} className={classNames(classes.paper, { [classes.isOver]: isOver })}>
            {clues[idx] ? clues[idx].label : ''}
        </Paper>
    );
};

export const Board = ({ round }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                {[...Array(2)].map((_, i) => (
                    <Grid key={`grid-${i}`} container item xs={12} spacing={2}>
                        {[...Array(4)].map((_, j) => (
                            <Grid key={`grid-${i}-${j}`} item xs={3}>
                                <Slot idx={i * 4 + j} round={round} />
                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};
