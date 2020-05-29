import { Meteor } from 'meteor/meteor';
import { UserStatus } from 'meteor/mizzao:user-status';
import '/imports/api';

Meteor.startup(() => {});

UserStatus.events.on('connectionLogout', (fields) => {
    console.log(fields);
});
