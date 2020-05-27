import React from 'react';

import { Games } from '/imports/api/games';
import { add } from '/imports/api/players/methods';

export const Create = () => {
  const createGame = async () => {
      const gameId = await Games.insert({});
      add.call({ name: 'player', gameId }, (response, error) => {
          console.log(response, error);
      });
  };

  return (
    <div>
      <button onClick={createGame}>Create game</button>
    </div>
  );
};
