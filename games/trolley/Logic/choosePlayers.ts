/** @file Functions suitable for passing to setActivePlayers
*/

import type {State, PlayerID, TrackTeamRoles} from '../types';

export function allButConductor<Stage extends string>(G: State, stage: Stage) : {
  value: {
    /* eslint-disable-next-line no-unused-vars */
    [playerId in PlayerID]?: Stage
  }
} {
  const value: {
    /* eslint-disable-next-line no-unused-vars */
    [playerId in PlayerID]?: Stage
  } = {};

  for (const playerId of G.teams.north.players) {
    value[playerId] = stage;
  }
  for (const playerId of G.teams.south.players) {
    value[playerId] = stage;
  }

  return {value};
}

export function onlyConductor<Stage extends string>(G: State, stage: Stage) : {
  value: {
    /* eslint-disable-next-line no-unused-vars */
    [playerId in PlayerID]?: Stage
  }
} {
  const value: {
    /* eslint-disable-next-line no-unused-vars */
    [playerId in PlayerID]?: Stage
  } = {
    [G.teams.conductor.player!]: stage,
  };

  return {value};
}

interface SetActivePlayersT<Stage extends string> {
  value: {
    /* eslint-disable-next-line no-unused-vars */
    [playerId in PlayerID]?: Stage
  };
  moveLimit?: number;
};

export function trackTeamRole<
  Role extends keyof TrackTeamRoles,
  Stage extends string
>(G: State, role: Role, stage: Stage, moveLimit?: number): SetActivePlayersT<Stage> {
  const value: SetActivePlayersT<Stage>['value'] = {};
  if ( role === 'modifier') {
    for ( const playerId of G.teams.north.roles.modifier ) {
      value[playerId] = stage;
    }
    for ( const playerId of G.teams.south.roles.modifier ) {
      value[playerId] = stage;
    }
  } else {
    // The type lookup isn't using the value guard to realize we can't pick the modifier role here.
    let playerID : PlayerID = G.teams.north.roles[role as 'innocent'|'guilty']!;
    value[playerID] = stage;
    playerID = G.teams.south.roles[role as 'innocent'|'guilty']!;
    value[playerID] = stage;
  }

  return {
    value,
    moveLimit,
  };
}
