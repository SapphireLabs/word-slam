import React from 'react';
import T from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { clues } from '/utils/fixtures';

const useCardStyles = makeStyles({
    root: {
        width: 150,
        marginTop: 8,
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
});

export const ClueCard = ({ label, type, onClickRight, onClickLeft }) => {
    const classes = useCardStyles();

    return (
        <Card className={classes.root}>
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
