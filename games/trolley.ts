// eslint-disable-next-line no-unused-vars
import {PlayerView, INVALID_MOVE} from 'boardgame.io/core';
import {Game} from 'boardgame.io';

import {State, Ctx, PlayerID, InnocentCard, GuiltyCard, ModifierCard} from './trolley/types';

import * as PickTeam from './trolley/Logic/Setup/pickTeam';
import * as PickRole from './trolley/Logic/Setup/pickRole';
import * as Main from './trolley/Logic/main';

// resolveJsonModule detects that 'deck' is a string, but doesn't detect it's always 'guilty'
import guiltyJSON from './trolley/Logic/Decks/guilty.json';
const guiltyCards = guiltyJSON as GuiltyCard[];
import innocentJSON from './trolley/Logic/Decks/innocent.json';
const innocentCards = innocentJSON as InnocentCard[];
import modifierJSON from './trolley/Logic/Decks/modifier.json';
const modifierCards = modifierJSON as ModifierCard[];

// TODO: minPlayers isn't doc'ed in Game, it's Lobby plugin specific?
// Provide our overridden Ctx to get improved playerID property.
interface LobbyGame extends Game<any, Ctx> {
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
    const players: Partial<State['players']> = {};
    for ( let i = 0; i < numPlayers; ++i ) {
      // Tell typescript we're SURE we're only producing valid playerIDs
      const playerID = ''+i as PlayerID;
      players[playerID] = {
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
          innocent: ctx.random.Shuffle(innocentCards), // eslint-disable-line new-cap
          guilty: ctx.random.Shuffle(guiltyCards), // eslint-disable-line new-cap
          modifier: ctx.random.Shuffle(modifierCards), // eslint-disable-line new-cap
        },
      },
      players: players as State['players'], // The Partial is now filled out
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
      turn: {
        stages: {
          playInnocent: {
            moves: {
              playInnocent: Main.playInnocent,
            },
          },
          playGuilty: {
            moves: {
              playGuilty: Main.playGuilty,
            },
          },
          playModifiers: {
            moves: {
              playModifier: Main.playModifier,
            },
          },
          chooseTrack: {
            moves: {
              chooseTrack: Main.chooseTrack,
            },
          },
        },
      },
    },
  },
  // Disable for development
  // TODO: Replace with something that only strips hand from players
  // playerView: PlayerView.STRIP_SECRETS
};
