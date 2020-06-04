import { Meteor } from 'meteor/meteor';
import { get } from 'lodash';

import { Players, remove } from '/imports/api/players';

// store 5 second timeouts for deleting players in memory?
const timeouts = {};

Meteor.publish('_connections', function(data) {
    if (data && get(timeouts, data)) {
        Players.update({ _id: data }, { $set: { isConnected: true } });

        clearTimeout(timeouts[data]);
        delete timeouts[data];
    }

    this._session.socket.on(
        'close',
        Meteor.bindEnvironment(() => {
            if (data) {
                // set player to disconnected
                Players.update({ _id: data }, { $set: { isConnected: false } });
                // refresh timer if exist
                if (get(timeouts, data)) {
                    clearTimeout(timeouts[data]);
                }
                timeouts[data] = setTimeout(
                    Meteor.bindEnvironment(() => {
                        remove.call({ _id: data });
                        delete timeouts[data];
                    }),
                    5000
                );
            }
        })
    );

    return this.ready();
});
