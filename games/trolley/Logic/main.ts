import {Ctx} from 'boardgame.io';
import {State, TrackTeam, Card} from '../types';
import {onlyConductor, trackTeamRole} from './choosePlayers';

function prepTeam(G: State, team:TrackTeam ) {
  /*
     Step 1: Everyone draws some cards
  */

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

function prepTracks(G: State) {
  /*
    Step 2: Every team plays a random innocent card
  */

  G.northTrack.length = 0;
  G.northTrack.push(
    G.secret!.decks.innocent.pop()!, // TODO: Verify there IS an innocent card available
  );

  G.southTrack.length = 0;
  G.southTrack.push(
    G.secret!.decks.innocent.pop()!, // TODO: Verify there IS an innocent card available
  );
}

export function onBegin(G: State, ctx: Ctx) {
  prepTeam(G, G.teams.north);
  prepTeam(G, G.teams.south);

  prepTracks(G);

  ctx.events?.setActivePlayers?.(
      trackTeamRole(G, 'innocent', 'playInnocent'),
  );
}

export function playInnocent(G: State, ctx: Ctx, card: Card) {
  // TODO: Detect which team the innocent player is on
  // Push the card onto the board

  ctx.events?.setActivePlayers?.(
      trackTeamRole(G, 'guilty', 'playGuilty'),
  );
}

export function playGuilty(G: State, ctx: Ctx, card: Card) {
  // TODO: Detect which team the guilty player is on
  // Push the card onto the board

  ctx.events?.setActivePlayers?.(
      trackTeamRole(G, 'guilty', 'playGuilty'),
  );
}

export function playModifier(G: State, ctx: Ctx, card: Card) {
  // TODO: Deal with choosing WHERE the innocent card should be played
  // North 0, 1, 2
  // South 0, 1, 2

  ctx.events?.setActivePlayers?.(
      onlyConductor(G, 'chooseTrack'),
  );
}

export function chooseTrack(G: State, ctx: Ctx, track: 'north'|'south') {

}
