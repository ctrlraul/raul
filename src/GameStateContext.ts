import { createContext } from "react";
import GameState from "./nort/classes/GameState";

const GameStateContext = createContext({} as GameState);

export default GameStateContext;
