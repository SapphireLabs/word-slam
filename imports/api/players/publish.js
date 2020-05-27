// import { Meteor } from 'meteor/meteor';
// import SimpleSchema from 'simpl-schema';
//
// import { Games } from '../games';
// import { Players } from './collection';
//
// Meteor.publishComposite('players.inGame', function(accessCode) {
//     new SimpleSchema({
//         accessCode: { type: String }
//     }).validate({ accessCode });
//
//     return {
//         find: () => {
//             const query = {
//                 accessCode
//             };
//
//             // We only need the _id field in this query, since it's
//             // only used to drive the child queries to get the players
//             const options = {
//                 fields: { _id: 1 }
//             };
//
//             return Games.find(query, options);
//         },
//         children: [
//             {
//                 find: (game) => {
//                     return Players.find(
//                         { gameId: game._id },
//                         { fields: Players.publicFields }
//                     );
//                 }
//             }
//         ],
//     };
// });
