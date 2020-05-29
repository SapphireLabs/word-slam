import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState, useMemo } from 'react';
import T from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';
import green from '@material-ui/core/colors/green';
import { makeStyles } from '@material-ui/core/styles';

import { add as addChat, Chats } from '/imports/api/chats';
import { Games } from '/imports/api/games';
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
    },
    system: {
        color: green[700],
    },
});

export const Chat = ({ gameId, playerId, players }) => {
    const classes = useStyles();
    const [message, setMessage] = useState('');
    const chats = useTracker(() => Chats.find({ gameId }, { sort: { createdAt: 1 } }).fetch());

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

        if (message.trim()) {
            addChat.call(
                { gameId, playerId, message: message.trim() },
                (_, { isRoundComplete }) => {
                    if (isRoundComplete) {
                        Meteor.setTimeout(() => {
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
                {chats.map((chat, i) => {
                    const player = get(playerMap, chat.playerId);

                    return (
                        <Typography
                            key={`chat-${i}`}
                            className={classNames(classes.pos, { [classes.system]: !player })}
                            variant="caption"
                        >
                            {!!player && (
                                <span className={classes.playerName}>{player.name}: </span>
                            )}
                            {chat.message}
                        </Typography>
                    );
                })}
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
