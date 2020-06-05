import { createContext, useContext } from 'react';

export const GameContext = createContext(null);

export const useGameContext = () => useContext(GameContext);
