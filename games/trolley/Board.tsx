import styles from './Components/style.module.sass';
import React, {FunctionComponent} from 'react';
import TeamPicker from './Components/TeamPicker';
import RolePicker from './Components/RolePicker';
import {State, BoardProps} from './types';

const TrolleyGameBoard: FunctionComponent<BoardProps<State>> = (
    {
      playerID,
      moves,
      ctx,
      G,
    },
) => {
  const onJoinTeam = (teamId: string) => {
    moves.chooseTeam(teamId);
  };

  const interactingPlayer = G.players[playerID];
  if (!interactingPlayer) {
    throw new Error('interacting player undefined');
  }

  const elementList: JSX.Element[] = [];
  if ( ctx.phase === 'setup' ) {
    if ( ctx.activePlayers === null ) {
      throw new Error('in setup phase and activePlayers null');
    }
    switch ( ctx.activePlayers[playerID] ) {
      case 'pickTeam':
        elementList.push(
            <TeamPicker key="teamPicker"
              teams={G.teams}
              player={interactingPlayer}
              playerId={playerID}
              onJoinTeam={onJoinTeam}
              onDone={moves.toggleDone}
            />,
        );
        break;
      case 'pickRole':
        const curTeam = interactingPlayer.team;
        if (curTeam === 'north' || curTeam === 'south') {
          elementList.push(
              <RolePicker key="rolePicker"
                team={G.teams[curTeam]}
                player={interactingPlayer}
                onJoinRole={moves.joinRole}
                onLeaveRole={moves.leaveRole}
                onDone={moves.toggleDone}
              />,
          );
        }
        break;
      default:
        elementList.push(
            <h1 key="wait">Please wait for other players...</h1>,
        );
    }
  }
  elementList.push(
      <div key="board">
        <img src='/trolley/board.png' alt='Trolley tracks' />
      </div>,
  );
  return (
    <div className={styles.board}>
      {elementList}
    </div>
  );
};

export {TrolleyGameBoard};
