import {Ctx} from 'boardgame.io';
import {INVALID_MOVE} from 'boardgame.io/core';
import {State, TrackTeam, Card, PlayerID, DeckType} from '../types';
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
      trackTeamRole(G, 'innocent', 'playInnocent', 1),
  );
}

function playCard<CardT extends Card>(G: State, playerID: PlayerID, hand: CardT[], cardIndex: number, role: DeckType) {
  if (-1 === cardIndex || cardIndex >= hand.length) {
    return INVALID_MOVE;
  }

  let track: Card[]|null = null;
  if ( G.players[playerID].team === 'north') {
    track = G.northTrack;
  } else if ( G.players[playerID].team === 'south') {
    track = G.southTrack;
  }
  if (track) {
    const splicedCards = hand.splice(cardIndex, 1) as [CardT];
    track.push(splicedCards[0]);
  } else {
    return INVALID_MOVE;
  }
}

export function playInnocent(G: State, ctx: Ctx, cardIndex: number) {
  const playerID = ctx.playerID as PlayerID;
  const innocentHand = G.players[playerID].innocentHand;
  if (!innocentHand) {
    return INVALID_MOVE;
  }

  const move = playCard(
      G,
      playerID,
      innocentHand,
      cardIndex,
      'innocent',
  );
  if ( move === INVALID_MOVE ) {
    return INVALID_MOVE;
  }

  // Only trigger this when both teams have played
  // Easiest test is to check length of tracks
  if (G.northTrack.length === G.southTrack.length ) {
    ctx.events?.setActivePlayers?.(
        trackTeamRole(G, 'guilty', 'playGuilty', 1),
    );
  }
}

export function playGuilty(G: State, ctx: Ctx, cardIndex: number) {
  const playerID = ctx.playerID as PlayerID;
  const guiltyHand = G.players[playerID].guiltyHand;
  if (!guiltyHand) {
    return INVALID_MOVE;
  }

  const move = playCard(
      G,
      playerID,
      guiltyHand,
      cardIndex,
      'guilty',
  );
  if ( move === INVALID_MOVE ) {
    return INVALID_MOVE;
  }

  // Only trigger this when both teams have played
  // Easiest test is to check length of tracks
  if (G.northTrack.length === G.southTrack.length ) {
    ctx.events?.setActivePlayers?.(
        trackTeamRole(G, 'modifier', 'playModifier', 1),
    );
  }
}

export function playModifier(G: State, ctx: Ctx, cardIndex: number) {
  // TODO: Deal with choosing WHERE the innocent card should be played
  // North 0, 1, 2
  // South 0, 1, 2

  const playerID = ctx.playerID as PlayerID;
  const modifierHand = G.players[playerID].modifierHand;
  if (!modifierHand) {
    return INVALID_MOVE;
  }

  const move = playCard(
      G,
      playerID,
      modifierHand,
      cardIndex,
      'modifier',
  );
  if ( move === INVALID_MOVE ) {
    return INVALID_MOVE;
  }

  // Only trigger this when both teams have played
  // Easiest test is to check length of tracks
  if (G.northTrack.length === G.southTrack.length ) {
    ctx.events?.setActivePlayers?.(
        onlyConductor(G, 'chooseTrack'),
    );
  }
}

export function chooseTrack(G: State, ctx: Ctx, track: 'north'|'south') {

}
