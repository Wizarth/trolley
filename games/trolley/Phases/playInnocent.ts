import {PhaseConfig} from 'boardgame.io';
import type {State, TrackTeam, Ctx} from '../types';
import clearChosenCards from '../Logic/clearChosenCards';
import {trackTeamRole} from '../Logic/choosePlayers';
import playCard from '../Logic/playCard';
import chooseCardT from '../Logic/chooseCard';
import cardsChosen from '../Logic/cardsChosen';

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


function onBegin(G: State, ctx: Ctx) {
  // As the first phase of a new round, this has extra setup
  // I tried having a phase that was just this prep, but this seemed to confuse things
  prepTeam(G, G.teams.north);
  prepTeam(G, G.teams.south);

  prepTracks(G);

  clearChosenCards(G);

  // Enable the innocent players
  ctx.events?.setActivePlayers?.(
      trackTeamRole(G, 'innocent', 'chooseCard', 1),
  );
}

function chooseCard(
    G: State,
    ctx: Ctx,
    cardIndex: number) {
  return chooseCardT(G, ctx, cardIndex, 'innocentHand');
}

function endIf(G: State, ctx: Ctx) {
  return cardsChosen(G, 'innocent');
}

function onEnd(G: State, ctx: Ctx) {
  const northPlayerID = G.teams.north.roles.innocent;
  const southPlayerID = G.teams.south.roles.innocent;
  // Should be impossible, but validate
  if (northPlayerID === null || southPlayerID === null) {
    return;
  }

  const northPlayer = G.players[northPlayerID];
  const southPlayer = G.players[southPlayerID];
  // Should be impossible, but validate
  if (
    !northPlayer.innocentHand || northPlayer.cardChosen === null ||
    !southPlayer.innocentHand || southPlayer.cardChosen === null ) {
    return;
  }

  playCard(G, northPlayer, northPlayer.innocentHand);
  playCard(G, southPlayer, southPlayer.innocentHand);
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
  next: 'playGuilty',
};

export default stage;
