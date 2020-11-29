// eslint-disable-next-line no-unused-vars
import {PlayerView, INVALID_MOVE} from 'boardgame.io/core';
import {Game} from 'boardgame.io';

import {State} from './trolley/types';

import * as PickTeam from './trolley/Logic/Setup/pickTeam';
import * as PickRole from './trolley/Logic/Setup/pickRole';
import * as Main from './trolley/Logic/main';

import guilty from './trolley/Logic/Decks/guilty.json';
import innocent from './trolley/Logic/Decks/innocent.json';
import modifier from './trolley/Logic/Decks/modifier.json';

// TODO: minPlayers isn't doc'ed in Game, it's Lobby plugin specific?
interface LobbyGame extends Game {
  minPlayers: number;
  maxPlayers: number;
}

export const TrolleyGame : LobbyGame = {
  name: 'TrialByTrolley',
  setup: (ctx) : State => {
    if (!ctx.random) {
      throw new Error('ctx.random missing');
    }
    const numPlayers = ctx.numPlayers;
    // Populate the players field based on the number of players
    const players: State['players'] = {};
    for ( let i = 0; i < numPlayers; ++i ) {
      players[''+i] = {
        name: null,
        score: 0,
        team: null,
        innocentHand: null,
        guiltyHand: null,
        modifierHand: null,
        teamsDone: false,
        rolesDone: false,
      };
    }

    return {
      secret: {
        decks: {
          innocent: ctx.random.Shuffle(innocent), // eslint-disable-line new-cap
          guilty: ctx.random.Shuffle(guilty), // eslint-disable-line new-cap
          modifier: ctx.random.Shuffle(modifier), // eslint-disable-line new-cap
        },
      },
      players,
      teams: {
        north: {
          players: [],
          roles: {
            innocent: null,
            guilty: null,
            modifier: [],
          },
        },
        south: {
          players: [],
          roles: {
            innocent: null,
            guilty: null,
            modifier: [],
          },
        },
        conductor: {
          player: null,
        },
      },
      northTrack: [],
      southTrack: [],
    };
  },
  minPlayers: 3,
  maxPlayers: 16,
  turn: {moveLimit: 1},
  phases: {
    setup: {
      start: true,
      turn: {
        activePlayers: {
          all: 'pickTeam',
        },
        stages: {
          pickTeam: {
            moves: {
              chooseTeam: PickTeam.chooseTeam,
              toggleDone: PickTeam.toggleDone,
            },
          },
          pickRole: {
            moves: {
              joinRole: PickRole.joinRole,
              leaveRole: PickRole.leaveRole,
              toggleDone: PickRole.toggleDone,
            },
          },
        },
      },
      endIf: PickRole.endIf,
      next: 'main',
    },
    main: {
      onBegin: Main.onBegin,
    },
  },
  // Disable for development
  // TODO: Replace with something that only strips hand from players
  // playerView: PlayerView.STRIP_SECRETS
};
