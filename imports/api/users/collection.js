import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

const userSchema = new SimpleSchema({
    status: {
        type: Object,
        optional: true,
    },
    'status.lastlogin': {
        type: Object,
        optional: true,
    },
    'status.lastlogin.date': {
        type: Date,
        optional: true,
    },
    'status.lastlogin.ipAddr': {
        type: String,
        optional: true,
    },
    'status.userAgent': {
        type: String,
        optional: true,
    },
    'status.idle': {
        type: Boolean,
        optional: true,
    },
    'status.lastActivity': {
        type: Date,
        optional: true,
    },
    'status.online': {
        type: Boolean,
        optional: true,
    },
});

// attaching the Schema to Meteor.users will extend it
Meteor.users.attachSchema(userSchema);
