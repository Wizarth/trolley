import {PhaseConfig} from 'boardgame.io';
import type {State, Ctx} from '../types';
import clearChosenCards from '../Logic/clearChosenCards';
import {trackTeamRole} from '../Logic/choosePlayers';
import playCard from '../Logic/playCard';
import chooseCardT from '../Logic/chooseCard';
import cardsChosen from '../Logic/cardsChosen';


function onBegin(G: State, ctx: Ctx) {
  clearChosenCards(G);

  // Enable the innocent players
  ctx.events?.setActivePlayers?.(
      trackTeamRole(G, 'guilty', 'chooseCard', 1),
  );
}

function chooseCard(
    G: State,
    ctx: Ctx,
    cardIndex: number) {
  return chooseCardT(G, ctx, cardIndex, 'guiltyHand');
}

function endIf(G: State, ctx: Ctx) {
  return cardsChosen(G, 'guilty');
}

function onEnd(G: State, ctx: Ctx) {
  const northPlayerID = G.teams.north.roles.guilty;
  const southPlayerID = G.teams.south.roles.guilty;
  // Should be impossible, but validate
  if (northPlayerID === null || southPlayerID === null) {
    return;
  }

  const northPlayer = G.players[northPlayerID];
  const southPlayer = G.players[southPlayerID];
  // Should be impossible, but validate
  if (
    !northPlayer.guiltyHand || northPlayer.cardChosen === null ||
    !southPlayer.guiltyHand || southPlayer.cardChosen === null ) {
    return;
  }

  playCard(G, northPlayer, northPlayer.guiltyHand);
  playCard(G, southPlayer, southPlayer.guiltyHand);
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
  next: 'playModifier',
};

export default stage;
