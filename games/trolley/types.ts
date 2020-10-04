// Cribbed from Boardgame.io
type PlayerID = string;

export interface State {
  secret?: StateSecrets;
  // The below type declaration implies there's a Player for ANY key.
  // This is true as long as a player ID is used to look it up
  players: Record<PlayerID,Player>;
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
  modifier: string[];
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
