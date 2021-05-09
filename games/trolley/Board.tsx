import styles from './Components/style.module.sass';
import React, {FunctionComponent} from 'react';
import TeamPicker from './Components/TeamPicker';
import RolePicker from './Components/RolePicker';
import Card from './Components/Card';
import CardPicker from './Components/CardPicker';
import {State, BoardProps} from './types';
import Image from 'next/image';

export const boardHeight = 520;

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
  // TODO: Redo this - componets for each phase?
  switch ( ctx.phase ) {
    case 'setup': {
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
      };
      break;
    };
    case 'playInnocent': {
      const innocentHand = G.players[playerID].innocentHand;
      if (innocentHand) {
        elementList.push(
            <CardPicker key="playInnocent" hand={innocentHand} deck='innocent' callback={moves.chooseCard} cardChosen={G.players[playerID].cardChosen}/>,
        );
      } else {
        elementList.push(
            <h1 key="wait">Please wait for other players...</h1>,
        );
      }
      break;
    }
    case 'playGuilty': {
      const guiltyHand = G.players[playerID].guiltyHand;
      if (guiltyHand) {
        elementList.push(
            <CardPicker key="playInnocent" hand={guiltyHand} deck='guilty' callback={moves.chooseCard} cardChosen={G.players[playerID].cardChosen}/>,
        );
      } else {
        elementList.push(
            <h1 key="wait">Please wait for other players...</h1>,
        );
      }
      break;
    }
    case 'playModifier': {
      const modifierHand = G.players[playerID].modifierHand;
      if (modifierHand) {
        elementList.push(
            <CardPicker key="playInnocent" hand={modifierHand} deck='modifier' callback={moves.chooseCard} cardChosen={G.players[playerID].cardChosen}/>,
        );
      } else {
        elementList.push(
            <h1 key="wait">Please wait for other players...</h1>,
        );
      }
      break;
    }
    case 'chooseTrack': {
      elementList.push(<div>TODO: Pick track?</div>);
      break;
    }
    default: {
      elementList.push(
          <h1 key="wait">Please wait for other players...</h1>,
      );
    }
  }

  const northTrack = <div className={styles.northTrack}>
    {
      G.northTrack.map(
          (card, key) => {
            return <Card key={key} card={card} />;
          },
      )
    }
  </div>;
  const southTrack = <div className={styles.southTrack}>
    {
      G.southTrack.map(
          (card, key) => {
            return <Card key={key} card={card} />;
          },
      )
    }
  </div>;

  elementList.push(
      <div key="board">
        <div className={styles.trackStart}>
          <Image src='/trolley/board.png' alt='Trolley tracks' height={boardHeight} width={520} />
        </div>
        {northTrack}
        {southTrack}
      </div>,
  );
  return (
    <div className={styles.board}>
      {elementList}
    </div>
  );
};

export {TrolleyGameBoard};
