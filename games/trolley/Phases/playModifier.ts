import {PhaseConfig} from 'boardgame.io';
import type {State, Ctx} from '../types';
import clearChosenCards from '../Logic/clearChosenCards';
import {trackTeamRole} from '../Logic/choosePlayers';
import chooseCardT from '../Logic/chooseCard';
import cardsChosen from '../Logic/cardsChosen';
import playCard from '../Logic/playCard';


function onBegin(G: State, ctx: Ctx) {
  clearChosenCards(G);

  // Enable the innocent players
  ctx.events?.setActivePlayers?.(
      trackTeamRole(G, 'modifier', 'chooseCard', 1),
  );
}

function chooseCard(
    G: State,
    ctx: Ctx,
    cardIndex: number) {
  return chooseCardT(G, ctx, cardIndex, 'modifierHand');
}

function endIf(G: State, ctx: Ctx) {
  return cardsChosen(G, 'modifier');
}

function onEnd(G: State, ctx: Ctx) {
  const playerIDs = G.teams.north.roles.modifier.concat(G.teams.south.roles.modifier);

  for (const playerID of playerIDs) {
    const player = G.players[playerID];
    // Should be impossible, but validate
    if ( !player.modifierHand || player.cardChosen === null ) {
      return;
    }
    playCard(G, player, player.modifierHand);
  }

  clearChosenCards(G);
}

const stage: PhaseConfig<State, Ctx> = {
  onBegin,
  turn: {
    stages: {
      chooseCard: {
        moves: {
          chooseCard,
        },
      },
    },
  },
  endIf,
  onEnd,
  next: 'chooseTrack',
};

export default stage;
