import React from 'react';
import classNames from 'classnames';
import { get, pick } from 'lodash';
import { useDrag, useDrop } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { green, grey } from '@material-ui/core/colors';

import { Rounds } from '/imports/api/rounds';
import { itemTypes } from '/utils/constants';

import { ClueActions } from './ClueActions';

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        marginBottom: 16,
        padding: theme.spacing(2),
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        padding: theme.spacing(1),
        height: 100,
        textAlign: 'center',
        color: theme.palette.text.secondary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    paperContent: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
    },
    important: {
        backgroundColor: theme.palette.warning.light,
    },
    isOver: {
        backgroundColor: green[200],
    },
    draggableSlot: {
        cursor: 'move',
    },
}));

const Slot = ({ idx, round, currentPlayer }) => {
    const classes = useStyles();

    const { _id, clues } = round;
    const clue = get(clues, `${currentPlayer.team}.${idx}`);

    // Handle drop
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
        collect: (monitor) => {
            return {
                isOver: !!monitor.isOver(),
            };
        },
    });

    // Handle dragging
    const [{ isDragging }, dragRef] = useDrag({
        item: { clue, type: itemTypes.SLOT, idx, team: currentPlayer.team },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        end: (item, monitor) => {
            const { idx } = item;

            const didDrop = monitor.didDrop();

            if (!didDrop) {
                Rounds.update(
                    { _id: round._id },
                    { $set: { [`clues.${currentPlayer.team}.${idx}`]: null } }
                );
            }
        },
    });

    // empty slot if no clue
    if (!clue) {
        return (
            <Paper
                ref={dropRef}
                className={classNames(classes.paper, { [classes.isOver]: isOver })}
            />
        );
    }

    const renderSlot = () => (
        <Paper
            ref={dropRef}
            className={classNames(classes.paper, {
                [classes.isOver]: isOver,
                [classes.important]: clue.important,
            })}
        >
            <div
                className={classes.paperContent}
                style={{ transform: `rotate(${clue.orientation * 180}deg)` }}
            >
                {clue.label}
            </div>
            {currentPlayer.isStoryteller && (
                <ClueActions clue={clue} round={round} currentPlayer={currentPlayer} idx={idx} />
            )}
        </Paper>
    );

    return currentPlayer.isStoryteller ? (
        <div className={classes.draggableSlot} ref={dragRef}>
            {renderSlot()}
        </div>
    ) : (
        renderSlot()
    );
};

export const Board = (props) => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Grid className={classes.center} container spacing={2}>
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
        </Paper>
    );
};
