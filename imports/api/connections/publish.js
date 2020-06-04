import { Meteor } from 'meteor/meteor';
import { get } from 'lodash';

import { Players, remove } from '/imports/api/players';

// store 5 second timeouts for deleting players in memory?
const timeouts = {};

Meteor.publish('_connections', function({ playerId, gameId }) {
    const key = playerId && gameId ? playerId + gameId : null;

    if (key && get(timeouts, key)) {
        Players.update({ _id: playerId }, { $set: { isConnected: true } });

        clearTimeout(timeouts[key]);
        delete timeouts[key];
    }

    this._session.socket.on(
        'close',
        Meteor.bindEnvironment(() => {
            if (key) {
                // set player to disconnected
                Players.update({ _id: playerId }, { $set: { isConnected: false } });
                // refresh timer if exist
                if (get(timeouts, key)) {
                    clearTimeout(timeouts[key]);
                }
                timeouts[key] = setTimeout(
                    Meteor.bindEnvironment(() => {
                        remove.call({ _id: playerId });
                        delete timeouts[key];
                    }),
                    5000
                );
            }
        })
    );

    return this.ready();
});
