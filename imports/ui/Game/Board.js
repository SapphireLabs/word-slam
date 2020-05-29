import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

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
}));

export const Board = () => {
    const classes = useStyles();

    function Row() {
        return (
            <React.Fragment>
                <Grid item xs={3}>
                    <Paper className={classes.paper} />
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper} />
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper} />
                </Grid>
                <Grid item xs={3}>
                    <Paper className={classes.paper} />
                </Grid>
            </React.Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid container item xs={12} spacing={2}>
                    <Row />
                </Grid>
                <Grid container item xs={12} spacing={2}>
                    <Row />
                </Grid>
            </Grid>
        </div>
    );
};
