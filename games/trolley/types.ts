import {Ctx as BaseCtx} from 'boardgame.io';
import {BoardProps as BaseBoardProps} from 'boardgame.io/react';

/*
  BaseCtx and BaseBoardProps have playerID as a string
  But really, it can only be 0 -> numPlayers
*/

export type PlayerID = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'11'|'12'|'13'|'14'|'15';

export interface Ctx extends Omit<BaseCtx, 'playerID'> {
  playerID: PlayerID;
}

export interface BoardProps<T> extends Omit<BaseBoardProps<T>, 'playerID'> {
  playerID: PlayerID;
  ctx: Ctx;
}

/* There's always a minimum of 3 players.
  I can't work out a way to clarify that this is somehow based on the number of players,
  so I'm going to say they all exist, and assume we won't be silly
*/
export interface Players {
  '0': Player;
  '1': Player;
  '2': Player;
  '3': Player;
  '4': Player;
  '5': Player;
  '6': Player;
  '7': Player;
  '8': Player;
  '9': Player;
  '10': Player;
  '11': Player;
  '12': Player;
  '13': Player;
  '14': Player;
  '15': Player;
}

export interface State {
  secret?: StateSecrets;
  players: Players;
  teams: StateTeams;
  northTrack: Card[];
  southTrack: Card[];
}

export interface StateDecks {
  innocent: Card[];
  guilty: Card[];
  modifier: Card[];
}

export interface StateSecrets {
  decks: StateDecks;
}

export interface Player {
  name: string|null;
  score: number;
  innocentHand: Card[]|null;
  guiltyHand: Card[]|null;
  modifierHand: Card[]|null;
  team: keyof StateTeams|null;
  teamsDone: boolean;
  rolesDone: boolean;
}

export interface StateTeams {
  north: TrackTeam;
  south: TrackTeam;
  conductor: TrolleyTeam;
}

export interface TrackTeamRoles {
  innocent: PlayerID|null;
  guilty: PlayerID|null;
  modifier: PlayerID[];
}

export interface TrackTeam {
  players: PlayerID[];
  roles: TrackTeamRoles;
}

export interface TrolleyTeam {
  player: PlayerID|null;
}

export interface Card {
  text: string;
}
