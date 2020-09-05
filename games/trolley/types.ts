export interface State {
  secret?: StateSecrets;
  players: Record<string, Player>;
  teams: StateTeams;
}

export interface StateDecks {
  goodies: object[];
  baddies: object[];
  modifiers: object[];
}

export interface StateSecrets {
  decks: StateDecks;
}

export interface Player {
  name: string|null;
  score: number;
  hand?: object[];
  choseTeam: boolean;
  teamsDone: boolean;
}

export interface StateTeams {
  top: TrackTeam;
  bottom: TrackTeam;
  trolley: TrolleyTeam;
}

export interface TrackTeam {
  players: string[];
  goodies: string[];
  baddies: string[];
  modifiers: string[];
}

export interface TrolleyTeam {
  player: string|null;
}
