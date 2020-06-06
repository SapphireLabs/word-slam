import React from 'react';
import classNames from 'classnames';
import { get, pick } from 'lodash';
import { useDrag, useDrop } from 'react-dnd';
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
    draggableSlot: {
        cursor: 'move',
    },
}));

const Slot = ({ idx, round, currentPlayer }) => {
    const { _id, clues } = round;
    const classes = useStyles();
    const [{ isOver }, dropRef] = useDrop({
        accept: [itemTypes.CLUE, itemTypes.SLOT],
        drop: (item) => {
            if (item.type === itemTypes.CLUE) {
                Rounds.update(
                    { _id },
                    {
                        $set: {
                            [`clues.${currentPlayer.team}.${idx}`]: pick(item, [
                                'label',
                                'category',
                            ]),
                        },
                    }
                );
            } else if (item.type === itemTypes.SLOT && item.idx !== idx) {
                Rounds.update(
                    { _id },
                    {
                        $set: {
                            [`clues.${currentPlayer.team}.${idx}`]: item.clue,
                            [`clues.${currentPlayer.team}.${item.idx}`]: null,
                        },
                    }
                );
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });
    const clue = get(clues, `${currentPlayer.team}.${idx}`);
    const [{ isDragging }, dragRef] = useDrag({
        item: { clue, type: itemTypes.SLOT, idx, team: currentPlayer.team },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const renderSlot = () => (
        <Paper ref={dropRef} className={classNames(classes.paper, { [classes.isOver]: isOver })}>
            {get(clue, 'label', '')}
        </Paper>
    );

    return clue ? (
        <span className={classes.draggableSlot} ref={dragRef}>
            {renderSlot()}
        </span>
    ) : (
        renderSlot()
    );
};

export const Board = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                {[...Array(2)].map((_, i) => (
                    <Grid key={`grid-${i}`} container item xs={12} spacing={2}>
                        {[...Array(4)].map((_, j) => (
                            <Grid key={`grid-${i}-${j}`} item xs={3}>
                                <Slot idx={i * 4 + j} {...props} />
                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};
