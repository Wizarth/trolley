import type {State, TrackTeamRoles, PlayerID} from '../types';

export default function cardsChosen(G: State, role: keyof TrackTeamRoles): boolean {
  let playerIDs: PlayerID[] = [];
  if (role === 'modifier') {
    playerIDs = playerIDs.concat(G.teams.north.roles.modifier);
    playerIDs = playerIDs.concat(G.teams.south.roles.modifier);
  } else {
    let playerID = G.teams.north.roles[role];
    if (playerID !== null) {
      playerIDs.push(playerID);
    }
    playerID = G.teams.south.roles[role];
    if (playerID !== null) {
      playerIDs.push(playerID);
    }
  }
  for (const playerID of playerIDs) {
    const player = G.players[playerID];
    if (player.cardChosen === null) {
      return false;
    }
  }
  return true;
}
