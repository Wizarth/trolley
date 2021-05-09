import {PhaseConfig} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import {State, TrackTeam, TrackTeamRoles, Ctx, PlayerID} from '../../types';

export function joinRole(G: State, ctx: Ctx, roleId: keyof TrackTeamRoles) {
  const playerID = ctx.playerID;
  if (!playerID) {
    return INVALID_MOVE;
  }
  const curTeam = G.players[
      playerID
  ].team;
  // conductor player should never get this move, but...
  if ( curTeam === 'conductor' || !curTeam) {
    return INVALID_MOVE;
  }
  const team = G.teams[curTeam];

  switch (roleId) {
    case 'innocent':
      team.roles.innocent = playerID;
      break;
    case 'guilty':
      team.roles.guilty = playerID;
      break;
    case 'modifier':
      team.roles.modifier.push(playerID);
  }
}

export function leaveRole(G: State, ctx: Ctx, roleId: keyof TrackTeamRoles) {
  const playerID = ctx.playerID;
  if (!playerID) {
    return INVALID_MOVE;
  }
  const curTeam = G.players[
      playerID
  ].team;
  // conductor player should never get this move, but...
  if ( curTeam === 'conductor' || !curTeam) {
    return INVALID_MOVE;
  }
  const team = G.teams[curTeam];

  switch (roleId) {
    case 'innocent':
      if (team.roles.innocent !== playerID) {
        return INVALID_MOVE;
      }
      team.roles.innocent = null;
      break;
    case 'guilty':
      if (team.roles.guilty !== playerID) {
        return INVALID_MOVE;
      }
      team.roles.guilty = null;
      break;
    case 'modifier':
      const rolePlayers = team.roles.modifier;
      const playerIndex = rolePlayers.indexOf(playerID);
      if (playerIndex===-1) {
        return INVALID_MOVE;
      }
      rolePlayers.splice(playerIndex, 1);
      break;
  }
}

export function toggleDone(G: State, ctx: Ctx) {
  const playerID = ctx.playerID;
  if (!playerID) {
    return INVALID_MOVE;
  }
  const curPlayer = G.players[
      playerID
  ];
  // conductor player should never get this move, but...
  if ( curPlayer.team === 'conductor' ) {
    return INVALID_MOVE;
  }

  curPlayer.rolesDone = !curPlayer.rolesDone;
}

function teamGood(team:TrackTeam) {
  return team.players.length &&
    team.roles.innocent &&
    team.roles.guilty &&
    team.roles.modifier.length;
};

const endIf: PhaseConfig<State>['endIf'] = (G, ctx) => {
  if (!G.teams.conductor.player) {
    return false;
  }
  for ( const key in G.players) {
    if (G.players.hasOwnProperty(key)) {
      const player = G.players[key as PlayerID];
      if (player.team === 'conductor') {
        continue;
      }
      if (!player.rolesDone) {
        return false;
      }
    }
  }
  if (!teamGood(G.teams.north)) {
    return false;
  }
  if (!teamGood(G.teams.south)) {
    return false;
  }
  // Go to next phase
  return true;
};

export {endIf};
