import {INVALID_MOVE} from 'boardgame.io/core';

import {State, Card, Player} from '../types';

export default function playCard<CardT extends Card>(
    G: State,
    player: Player,
    hand: CardT[],
    cardIndex: number|null = player.cardChosen,
) {
  if (-1 === cardIndex || null === cardIndex || cardIndex >= hand.length) {
    return INVALID_MOVE;
  }

  let track: Card[]|null = null;
  if ( player.team === 'north') {
    track = G.northTrack;
  } else if ( player.team === 'south') {
    track = G.southTrack;
  }
  if (track) {
    const splicedCards = hand.splice(cardIndex, 1) as [CardT];
    track.push(splicedCards[0]);
  } else {
    return INVALID_MOVE;
  }
}
