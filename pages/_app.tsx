import '../styles/globals.css'

import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { TrolleyGame } from '../games/trolley';
import { TrolleyGameBoard } from '../games/trolley/Board';

/*
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
*/

const TrolleyGameClient = Client({
	game: TrolleyGame,
	numPlayers: 3,
	board: TrolleyGameBoard,
  multiplayer: Local(),
});

const App = () => (
	<div>
		<h1>Player 0</h1>
		<TrolleyGameClient playerID="0"/>
		<h1>Player 1</h1>
		<TrolleyGameClient playerID="1"/>
		<h1>Player 2</h1>
		<TrolleyGameClient playerID="2"/>
	</div>
);

export default App;
