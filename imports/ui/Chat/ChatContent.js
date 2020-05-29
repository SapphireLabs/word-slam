import React, { useEffect } from 'react';
import classNames from 'classnames';
import { get } from 'lodash';
import { useTracker } from 'meteor/react-meteor-data';
import Typography from '@material-ui/core/Typography';

import { Chats } from '/imports/api/chats';

export const ChatContent = ({ classes, playerMap, gameId }) => {
    const chats = useTracker(() => Chats.find({ gameId }, { sort: { createdAt: 1 } }).fetch());

    useEffect(() => {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    return (
        <>
            {chats.map((chat, i) => {
                const player = get(playerMap, chat.playerId);

                return (
                    <Typography
                        key={chat._id}
                        className={classNames(classes.pos, { [classes.system]: !player })}
                        variant="caption"
                    >
                        {!!player && <span className={classes.playerName}>{player.name}: </span>}
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
        </>
    );
};
