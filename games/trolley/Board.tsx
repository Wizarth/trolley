import styles from './Components/style.module.sass'

import React, {FunctionComponent} from 'react';
import TeamPicker from './Components/TeamPicker';
import RolePicker from './Components/RolePicker';
import { BoardProps } from 'boardgame.io/react';
import {State} from './types';


const TrolleyGameBoard: FunctionComponent<BoardProps<State>> = (
	{
		playerID,
		moves,
		ctx,
		G
	}
) => {
	const onJoinTeam = (teamId: string) => {
		moves.chooseTeam(teamId);
	}

	if(playerID === null) {
		throw new Error("playerID null");
	}
	if(ctx.activePlayers === null ) {
		// This happens when leaving a phase?
		// throw new Error("activePlayers null")
		return null;
	}
	const interactingPlayer = G.players[playerID];
	if(!interactingPlayer) {
		throw new Error("interacting player null");
	}

	let elementList: JSX.Element[] = [];
	if( ctx.phase === 'setup' ){
		switch( ctx.activePlayers[playerID] ) {
			case 'pickTeam':
				elementList.push(
					<TeamPicker key="teamPicker"
						teams={G.teams}
						player={interactingPlayer}
						playerId={playerID}
						onJoinTeam={onJoinTeam}
						onDone={moves.toggleDone}
					/>
				);
				break;
			case 'pickRole':
				const curTeam = interactingPlayer.team;
				if(curTeam === "north" || curTeam === "south") {
					elementList.push(
						<RolePicker key="rolePicker"
							team={G.teams[curTeam]}
							player={interactingPlayer}
							onJoinRole={moves.joinRole}
							onLeaveRole={moves.leaveRole}
							onDone={moves.toggleDone}
						/>
					);
				}
				break;
			default:
				elementList.push(
					<h1 key="wait">Please wait for other players...</h1>
				);
		}
	}
	elementList.push(
		<div key="board">Board goes here</div>
	)
	return (
		<div className={styles.board}>
			{elementList}
		</div>
	);
};

export {TrolleyGameBoard};
