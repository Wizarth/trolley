import type {FunctionComponent} from 'react';
import Spinner from 'react-spinner';
import {useCookies} from 'react-cookie';
import { useRouter } from 'next/router';

import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer'

import { TrolleyGame } from '../../games/trolley';
import { TrolleyGameBoard } from '../../games/trolley/Board';

const TrolleyGamePage: FunctionComponent = () => {
  const router = useRouter()
  const { matchID } = router.query;
  // Also: playerID, credentials - Pull these from cookies so players sharing the match don't mangle

  // Blank during SSR
  if(!matchID) {
    return <Spinner />;
  }
  if(matchID instanceof Array) {
    throw new Error('matchID not specified');
  }

  // TODO: Validate the game exists.

  const [cookies] = useCookies(['playerID, credentials']);
  const {playerID, credentials} = cookies;
  if(!playerID || !credentials) {
    // TODO: Display enough of the lobby to join appropriately, but only showing this match
    throw new Error('Invalid cookies');
  }

  const TrolleyGameClient = Client({
  	game: TrolleyGame,
  	numPlayers: 3,
  	board: TrolleyGameBoard,
    multiplayer: SocketIO(),
  });

  return (
    <TrolleyGameClient matchID={matchID} playerID={playerID} credentials={credentials} />
  )
}

export default TrolleyGamePage;
