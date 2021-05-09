import type {State, Players} from '../types';

export default function clearChosenCards(G: State) {
  for ( let playerIDN = 0; playerIDN < 16; ++playerIDN) {
    const playerID = ''+playerIDN as keyof Players;
    const player = G.players[playerID];
    if (player) {
      player.cardChosen = null;
    }
  }
}
