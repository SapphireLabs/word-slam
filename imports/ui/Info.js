import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import { Games } from '/imports/api/games';

export const Info = () => {
  const games = useTracker(() => {
    return Games.find().fetch();
  });

  return (
    <div>
      <h2>Current games</h2>
      <ul>{games.map(game => (
          <li key={game._id}>
              <a href={game.accessCode} target="_blank">{game.accessCode}</a>
            </li>
      ))}</ul>
    </div>
  );
};
