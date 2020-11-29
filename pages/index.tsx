import {Lobby} from 'boardgame.io/react';
import React, {FunctionComponent, useState, useEffect} from 'react';
import Spinner from 'react-spinner';

import {TrolleyGame} from '../games/trolley';
import {TrolleyGameBoard} from '../games/trolley/Board';

const Index: FunctionComponent<void> = () => {
  const [server, setServer] = useState<string|null>(null);

  useEffect(() => {
    const {protocol, hostname, port} = window.location;
    const server = `${protocol}//${hostname}:${port}`;

    setServer(server);
  }, []);

  if (!server) {
    return (<Spinner/>);
  } else {
    const importedGames = [{game: TrolleyGame, board: TrolleyGameBoard}];

    return (
      <div>
        <h1>Lobby</h1>
        <Lobby gameServer={server} lobbyServer={server} gameComponents={importedGames} debug={true}/>
      </div>
    );
  }
};

export default Index;
