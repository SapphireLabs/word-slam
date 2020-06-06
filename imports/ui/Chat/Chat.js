import { Meteor } from 'meteor/meteor';
import React, { useState, useMemo } from 'react';
import T from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { red, blue, green, grey } from '@material-ui/core/colors';

import { add as addRound } from '/imports/api/rounds';
import { add as addChat } from '/imports/api/chats';
import { Games } from '/imports/api/games';
import { ChatContent } from './ChatContent';

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
        borderBottom: `1px solid ${grey[200]}`,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 2,
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
        color: grey[800],
    },
    Red: {
        color: red[800],
    },
    Blue: {
        color: blue[800],
    },
    system: {
        color: green[700],
    },
});

export const Chat = ({ chats, gameId, playerId, players }) => {
    const classes = useStyles();
    const [message, setMessage] = useState('');

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

        if (message.trim()) {
            addChat.call(
                { gameId, playerId, message: message.trim() },
                (_, { isRoundComplete }) => {
                    if (isRoundComplete) {
                        Meteor.setTimeout(() => {
                            addRound.call({ gameId });
                            Games.update(
                                { _id: gameId },
                                {
                                    $set: {
                                        status: 'WAITING',
                                    },
                                }
                            );
                        }, 5000);
                    }
                }
            );
            setMessage('');
        }
    };

    return (
        <Card className={classes.root}>
            <CardContent className={classes.content}>
                <ChatContent
                    classes={classes}
                    chats={chats}
                    playerMap={playerMap}
                    gameId={gameId}
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
