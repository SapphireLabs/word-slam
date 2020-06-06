import { Meteor } from 'meteor/meteor';
import { get } from 'lodash';

import { Players, remove } from '/imports/api/players';

// store 5 second timeouts for deleting players
const timeouts = {};
const insert = (playerId, gameId, t) => {
    if (!timeouts[playerId]) {
        timeouts[playerId] = {};
    }
    timeouts[playerId][gameId] = t;
};

Meteor.publish('_connections', function({ playerId, gameId }) {
    if (playerId && gameId) {
        // update player connection status
        Players.update({ _id: playerId }, { $set: { gameId, isConnected: true } });

        // clear existing deletes
        const existingTimeouts = get(timeouts, playerId, {});
        Object.keys(existingTimeouts).forEach((id) => {
            clearTimeout(existingTimeouts[id]);
            delete existingTimeouts[id];
        });
    }

    this._session.socket.on(
        'close',
        Meteor.bindEnvironment(() => {
            if (playerId && gameId) {
                // set player to disconnected
                Players.update({ _id: playerId }, { $set: { isConnected: false } });

                // delete player in 5 seconds
                insert(
                    playerId,
                    gameId,
                    setTimeout(
                        Meteor.bindEnvironment(() => {
                            remove.call({ _id: playerId });
                            delete timeouts[playerId][gameId];
                        }),
                        5000
                    )
                );
            }
        })
    );

    return this.ready();
});
