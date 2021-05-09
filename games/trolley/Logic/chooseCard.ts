import {INVALID_MOVE} from 'boardgame.io/core';
import type {State, Ctx, PlayerID} from '../types';

export default function chooseCardT<Hand extends 'innocentHand'|'guiltyHand'|'modifierHand'>(
    G: State,
    ctx: Ctx,
    cardIndex: number,
    hand: Hand,
) {
  const playerID = ctx.playerID as PlayerID;
  const player = G.players[playerID];
  const innocentHand = player[hand];
  if (!innocentHand) {
    return INVALID_MOVE;
  }
  // A card has already been chosen
  if (player.cardChosen !== null) {
    return INVALID_MOVE;
  }
  player.cardChosen = cardIndex;
}
