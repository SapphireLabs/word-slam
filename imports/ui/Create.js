import React from 'react';

import { Games } from '/imports/api/games';

export const Create = () => {
  const createGame = () => {
      Games.insert({});
  };

  return (
    <div>
      <button onClick={createGame}>Create game</button>
    </div>
  );
};
