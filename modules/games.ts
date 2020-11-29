import type {LobbyAPI} from 'boardgame.io';

import fetch from 'node-fetch';

export interface MatchProps {
  matchID: string;
  players: object[];
  setupData?: object;
}

export async function getMatches(gameName: string): Promise<MatchProps[]> {
  // TODO: Pull this info from somewhere better
  // We might not even need to actually fetch, it's implemented using koa in the
  // current application. Might even be able to pull something from the
  // boardgames.io module

  const response = await fetch(`http://localhost:3000/games/${gameName}`);
  const {matches} = await response.json() as LobbyAPI.MatchList;

  console.log(`${gameName} Rooms: ${JSON.stringify(matches)}`);
  return matches;
}

export async function getGame(gameName: string, matchID: string): Promise<MatchProps|null> {
  // TODO: Fetch the game data using params.matchID
  const response = await fetch(`http://localhost:3000/games/${gameName}/${matchID}`);
  if (!response.ok || response.status === 404 ) {
    return null;
  }
  const game = await response.json() as MatchProps;

  console.log(JSON.stringify(game));
  return game;
}
