import { PlayerView, INVALID_MOVE } from 'boardgame.io/core';
import { Game, Ctx } from 'boardgame.io';

import { State, Player } from './trolley/types';

export const TrolleyGame : Game = {
	name: 'TrolleyGame',
	setup: (ctx) : State => {
		const numPlayers = ctx.numPlayers;
		// Populate the players field based on the number of players
		const players: Record<string, Player> = {};
		for( let i = 0; i < numPlayers; ++i ) {
			players[""+i] = {
				name: null,
				score: 0,
				choseTeam: false,
				teamsDone: false
			};
		}
		return {
			secret: {
				decks: {
					goodies: [],
					baddies: [],
					modifiers: []
				}
			},
			players,
			teams: {
				top: {
					players: [],
					goodies: [],
					baddies: [],
					modifiers: []
				},
				bottom: {
					players: [],
					goodies: [],
					baddies: [],
					modifiers: []
				},
				trolley: {
					player: null
				}
			}
		};
	},
	// TODO: minPlayers isn't doc'ed in Game, it's Lobby plugin specific?
	// minPlayers: 3,
	turn: { moveLimit: 1 },
	phases: {
		setup: {
			start: true,
			onBegin: (G: State, ctx: Ctx) => {
				ctx.events.setActivePlayers({all: 'pickTeam'});
			},
			turn: {
				stages: {
					pickTeam: {
						moves: {
							chooseTeam: (G: State, ctx: Ctx, teamId: string) => {
								// Remove the player from all teams
								G.teams.top.players = G.teams.top.players.filter(
									(player: string) => player !== ctx.playerID
								);
								G.teams.bottom.players = G.teams.bottom.players.filter(
									(player: string) => player !== ctx.playerID
								);
								if( G.teams.trolley.player === ctx.playerID ) {
									G.teams.trolley.player = null;
								}
								// Add the player to the specified team
								if( teamId === 'top' || teamId === 'bottom') {
									G.teams[teamId].players.push(ctx.playerID);
								} else {
									G.teams[teamId].player = ctx.playerID;
								}
								G.players[ctx.playerID].choseTeam = true;
								G.players[ctx.playerID].teamsDone = false;
							},
							toggleDone: (G: State, ctx: Ctx) => {
								if(!G.players[ctx.playerID].choseTeam) {
									return INVALID_MOVE;
								}
								G.players[ctx.playerID].teamsDone = !G.players[ctx.playerID].teamsDone;

								for(let i = 0; i < ctx.numPlayers; ++i) {
									if(!G.players[""+i].teamsDone) {
										return;
									}
								}
								if(G.teams.top.players.length === 0 ) {
									return;
								}
								if(G.teams.bottom.players.length === 0 ) {
									return;
								}
								if(G.teams.trolley.player === null ) {
									return;
								}
								// Only players on track teams go to pick role.
								// Trolley player is all set
								const value = {};
								for(let i = 0 ; i < G.teams.top.players.length; ++i ) {
									value[G.teams.top.players[i]] = 'pickRole';
								}
								for(let i = 0 ; i < G.teams.bottom.players.length; ++i ) {
									value[G.teams.bottom.players[i]] = 'pickRole';
								}
								ctx.events.setActivePlayers({value});
							}
						}
					},
					pickRole: {
						moves: {
							joinRole: (G, ctx, roleId) => {
							},
							leaveRole: (G, ctx, roleId) => {
							},
							done: (G, ctx) => {
								// TODO: Don't allow to end the stage until all roles are filled
								ctx.events.endStage();
							}
						}
					}
				}
			}
		}
	}
	// Disable for development
	// TODO: Replace with something that only strips hand from players
	// playerView: PlayerView.STRIP_SECRETS
};
