import React, { useEffect } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

export const ChatContent = ({ classes, chats }) => {
    useEffect(() => {
        this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    return (
        <>
            {chats.map((chat) => {
                return (
                    <Typography
                        key={chat._id}
                        className={classNames(classes.pos, { [classes.system]: !chat.name })}
                        variant="caption"
                    >
                        {!!chat.name && (
                            <span className={classNames(classes.playerName, classes[chat.team])}>
                                {chat.name}:{' '}
                            </span>
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
        </>
    );
};
