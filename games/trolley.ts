import { PlayerView, INVALID_MOVE } from 'boardgame.io/core';
import { Game, Ctx } from 'boardgame.io';

import { State, Card, SetupData} from './trolley/types';

import * as PickTeam from './trolley/Logic/Setup/pickTeam'
import * as PickRole from './trolley/Logic/Setup/pickRole';
import * as Main from './trolley/Logic/main';

import guilty from './trolley/Logic/Decks/guilty.json';
import innocent from './trolley/Logic/Decks/innocent.json';
import modifier from './trolley/Logic/Decks/modifier.json';

export const TrolleyGame : Game = {
	name: 'TrolleyGame',
	setup: (ctx) : State => {
		if(!ctx.random) {
			throw new Error('ctx.random missing');
		}
		const numPlayers = ctx.numPlayers;
		// Populate the players field based on the number of players
		const players: State["players"] = {};
		for( let i = 0; i < numPlayers; ++i ) {
			players[""+i] = {
				name: null,
				score: 0,
				team: null,
				innocentHand: null,
				guiltyHand: null,
				modifierHand: null,
				teamsDone: false,
				rolesDone: false
			};
		}

		return {
			secret: {
				decks: {
					innocent: ctx.random.Shuffle(innocent),
					guilty: ctx.random.Shuffle(guilty),
					modifier: ctx.random.Shuffle(modifier)
				}
			},
			players,
			teams: {
				north: {
					players: [],
					roles: {
						innocent: null,
						guilty: null,
						modifier: []
					}
				},
				south: {
					players: [],
					roles: {
						innocent: null,
						guilty: null,
						modifier: []
					}
				},
				conductor: {
					player: null
				}
			},
			northTrack: [],
			southTrack: []
		};
	},
	// TODO: minPlayers isn't doc'ed in Game, it's Lobby plugin specific?
	minPlayers: 3,
	maxPlayers: 16,
	turn: { moveLimit: 1 },
	phases: {
		setup: {
			start: true,
			turn: {
				activePlayers: {
					all: 'pickTeam'
				},
				stages: {
					pickTeam: {
						moves: {
							chooseTeam: PickTeam.chooseTeam,
							toggleDone: PickTeam.toggleDone
						}
					},
					pickRole: {
						moves: {
							joinRole: PickRole.joinRole,
							leaveRole: PickRole.leaveRole,
							toggleDone: PickRole.toggleDone
						}
					}
				}
			},
			endIf: PickRole.endIf,
			next: 'main'
		},
		main: {
			onBegin: Main.onBegin
		}
	}
	// Disable for development
	// TODO: Replace with something that only strips hand from players
	// playerView: PlayerView.STRIP_SECRETS
};
