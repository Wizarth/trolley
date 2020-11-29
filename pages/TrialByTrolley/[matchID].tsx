import React from 'react';
import type {FunctionComponent} from 'react';
import Spinner from 'react-spinner';
import {useCookies} from 'react-cookie';
import type {GetServerSideProps} from 'next';
import {useRouter} from 'next/router';
import {Client} from 'boardgame.io/react';
import {SocketIO} from 'boardgame.io/multiplayer';

import {TrolleyGame} from '../../games/trolley';
import {TrolleyGameBoard} from '../../games/trolley/Board';
import {getGame} from '../../modules/games';

const TrolleyGamePage: FunctionComponent<{notFound:boolean}> = ({notFound}) => {
  // All use* hooks at the start to ensure goodness
  const router = useRouter();
  const [cookies] = useCookies(['playerID, credentials']);
  const {matchID} = router.query;

  // Blank during SSR
  if (!matchID || notFound) {
    return <Spinner />;
  }
  if (matchID instanceof Array) {
    throw new Error('matchID not specified');
  }

  const {playerID, credentials} = cookies;
  if (!playerID || !credentials) {
    // TODO: Display enough of the lobby to join appropriately, but only showing this match
    // throw new Error('Invalid cookies');
    // SSR requires:
    return <Spinner />;
  }

  // eslint-disable-next-line new-cap
  const TrolleyGameClient = Client({
    game: TrolleyGame,
    numPlayers: 3,
    board: TrolleyGameBoard,
    multiplayer: SocketIO(), // eslint-disable-line new-cap
  });

  return (
    <TrolleyGameClient matchID={matchID} playerID={playerID} credentials={credentials} />
  );
};

export default TrolleyGamePage;

const getServerSideProps: GetServerSideProps = async ({params}) => {
  if (!params) {
    return {
      props: {
        notFound: true,
      },
    };
  }
  const matchID = params.matchID;
  if (!matchID || matchID instanceof Array) {
    return {
      props: {
        notFound: true,
      },
    };
  }

  if (! await getGame('TrolleyGame', matchID)) {
    return {
      props: {
        notFound: true,
      },
    };
  }

  return {
    props: {
      notFound: false,
    },
  };
};

export {getServerSideProps};
