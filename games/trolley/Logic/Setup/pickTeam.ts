import {INVALID_MOVE} from 'boardgame.io/core';
import {State, StateTeams, Ctx, PlayerID} from '../../types';
import {allButConductor} from '../choosePlayers';

export function chooseTeam(G: State, ctx: Ctx, teamId: keyof StateTeams) {
  // Remove the player from all teams
  G.teams.north.players = G.teams.north.players.filter(
      (player) => player !== ctx.playerID,
  );
  G.teams.south.players = G.teams.south.players.filter(
      (player) => player !== ctx.playerID,
  );
  if ( G.teams.conductor.player === ctx.playerID ) {
    G.teams.conductor.player = null;
  }
  // Add the player to the specified team
  if ( teamId === 'north' || teamId === 'south') {
    G.teams[teamId].players.push(ctx.playerID);
  } else {
    G.teams[teamId].player = ctx.playerID;
  }
  const curPlayer = G.players[ctx.playerID];
  curPlayer.team = teamId;
  curPlayer.teamsDone = false;
}

export function toggleDone(G: State, ctx: Ctx) {
  const curPlayer = G.players[ctx.playerID];
  if (!curPlayer.team) {
    return INVALID_MOVE;
  }
  curPlayer.teamsDone = !curPlayer.teamsDone;

  for (const key in G.players) {
    if (G.players.hasOwnProperty(key)) {
      const player = G.players[key as PlayerID];
      if (!player.teamsDone) {
        return;
      }
    }
  }
  if (G.teams.north.players.length === 0 ) {
    return;
  }
  if (G.teams.south.players.length === 0 ) {
    return;
  }
  if (G.teams.conductor.player === null ) {
    return;
  }

  // TODO: If a team has only a single player, asign them all roles

  // Only players on track teams go to pick role.
  // Trolley player is all set
  ctx.events?.setActivePlayers?.(
      allButConductor(G, 'pickRole'),
  );
}
