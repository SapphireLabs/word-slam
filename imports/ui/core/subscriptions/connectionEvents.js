import { Meteor } from 'meteor/meteor';

export const Connections = {
    assign: (data) => {
        Meteor.subscribe('_connections', data);
    },
};
