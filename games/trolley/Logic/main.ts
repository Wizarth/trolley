import {Ctx} from 'boardgame.io';
import {State, TrackTeam, Card} from '../types';

function prepTeam(G: State, team:TrackTeam ) {
  const innocentPlayer = G.players[
    team.roles.innocent! // To get here, there MUST be an innocent assigned
  ];
  innocentPlayer.innocentHand = G.secret!.decks.innocent.splice(0, 3);

  const guiltyPlayer = G.players[
    team.roles.guilty!
  ];
  guiltyPlayer.guiltyHand = G.secret!.decks.guilty.splice(0, 3);

  for ( const modifierPlayerId of team.roles.modifier) {
    const modifierPlayer = G.players[modifierPlayerId];
    modifierPlayer.modifierHand = G.secret!.decks.modifier.splice(0, 3);
  }
}

export function onBegin(G: State, ctx: Ctx) {
  prepTeam(G, G.teams.north);
  prepTeam(G, G.teams.south);
}

export function playInnocent(G: State, ctx: Ctx, card: Card) {

}

export function playGuilty(G: State, ctx: Ctx, card: Card) {
}

export function playModifier(G: State, ctx: Ctx, card: Card) {
  // TODO: Deal with choosing WHERE the innocent card should be played
  // North 0, 1, 2
  // South 0, 1, 2
}

export function chooseTrack(G: State, ctx: Ctx, track: 'north'|'south') {

}
