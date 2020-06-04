import React, { useEffect } from 'react';
import classNames from 'classnames';
import { get } from 'lodash';
import Typography from '@material-ui/core/Typography';

export const ChatContent = ({ classes, chats, playerMap, gameId }) => {
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
