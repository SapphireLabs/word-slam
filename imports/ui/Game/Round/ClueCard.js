import React from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { useDrag } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { clues } from '/utils/fixtures';
import { itemTypes } from '/utils/constants';

const useCardStyles = makeStyles({
    root: {
        width: 150,
        marginTop: 8,
        cursor: 'move',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    isDragging: {
        opacity: 0.5,
    },
});

export const ClueCard = ({ label, type, onClickRight, onClickLeft }) => {
    const classes = useCardStyles();
    const [{ isDragging }, dragRef] = useDrag({
        item: { label, category: type, type: itemTypes.CLUE },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <Card
            className={classNames(classes.root, { [classes.isDragging]: isDragging })}
            ref={dragRef}
        >
            <CardContent>
                <Typography variant="h5" component="h2">
                    {label}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    {type}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={onClickLeft}>
                    Prev
                </Button>
                <Button size="small" onClick={onClickRight}>
                    Next
                </Button>
            </CardActions>
        </Card>
    );
};

ClueCard.propTypes = {
    label: T.string.isRequired,
    type: T.oneOf(Object.keys(clues)),
    onClickLeft: T.func.isRequired,
    onClickRight: T.func.isRequired,
};
