import React, { useEffect, useState, useMemo } from 'react';
import T from 'prop-types';
import { useTracker } from 'meteor/react-meteor-data';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { Chats } from '/imports/api/chats';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    root: {
        width: '100%',
        marginTop: 8,
    },
    content: {
        height: 200,
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 4,
    },
    fullWidth: {
        width: '100%',
        display: 'flex',
    },
    textInput: {
        flex: 1,
        marginRight: 4,
    },
    playerName: {
        fontWeight: 600,
    },
});

export const Chat = ({ gameId, playerId, players }) => {
    const classes = useStyles();
    const [message, setMessage] = useState('');
    const chats = useTracker(() => Chats.find({ gameId })).fetch();

    useEffect(() => {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    const playerMap = useMemo(
        () =>
            players.reduce((map, p) => {
                map[p._id] = p;

                return map;
            }, {}),
        [players]
    );

    const onChange = (e) => setMessage(e.target.value);

    const onSubmit = (e) => {
        e.preventDefault();

        console.log(message);
        if (message) {
            Chats.insert({ gameId, playerId, message });
            setMessage('');
        }
    };

    return (
        <Card className={classes.root}>
            <CardContent className={classes.content}>
                {chats.map((chat) => (
                    <Typography className={classes.pos} variant="p">
                        <span className={classes.playerName}>{playerMap[chat.playerId].name}:</span>{' '}
                        {chat.message}
                    </Typography>
                ))}
                <div
                    style={{ float: 'left', clear: 'both' }}
                    ref={(el) => {
                        this.messagesEnd = el;
                    }}
                />
            </CardContent>
            <CardActions>
                <form className={classes.fullWidth} onSubmit={onSubmit}>
                    <TextField className={classes.textInput} onChange={onChange} value={message} />
                    <Button size="small" type="submit" variant="outlined">
                        Send
                    </Button>
                </form>
            </CardActions>
        </Card>
    );
};

Chat.propTypes = {
    gameId: T.string,
    playerId: T.string,
    players: T.array,
};
