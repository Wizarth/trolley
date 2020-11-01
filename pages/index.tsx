import { Lobby } from 'boardgame.io/react';
import React from 'react';
import { TrolleyGame } from '../games/trolley';
import { TrolleyGameBoard } from '../games/trolley/Board';

interface State {
  server: string|null;
}

class Index extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      server: null
    }
  }

  componentDidMount() {
    const { protocol, hostname, port } = window.location;
    const server = `${protocol}//${hostname}:${port}`;

    this.setState({server});
  }

  render() {
    if(!this.state.server)
    {
      return (<h1>Connecting...</h1>);
    }
    /*

    */
    const importedGames = [{ game: TrolleyGame, board: TrolleyGameBoard }];

    return (
      <div>
        <h1>Lobby</h1>
        <Lobby gameServer={this.state.server} lobbyServer={this.state.server} gameComponents={importedGames} debug={true}/>
      </div>
    )
  }
};

export default Index;
