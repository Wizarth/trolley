import React from 'react';
import {TrolleyTeam as TrolleyTeamT} from './types';
import style from './style.module.sass';
import BoardArea from '../../components/BoardArea';


type ParamsT = {
	team: TrolleyTeamT;
	teamId: string;
	playerId: string;
	onJoinTeam: (teamId: string) => void;
}

export default function TrolleyTeam( {team, playerId, onJoinTeam}: ParamsT ){
	let playerName: JSX.Element;
	let button: JSX.Element;

	if( team.player === null ) {
		playerName = <div><i>None</i></div>
	} else {
		playerName = <div><span>{team.player}</span></div>
	}
	if( team.player !== playerId) {
		// Player not in team
		button = <button onClick={()=>onJoinTeam('trolley')}>Join</button>
	}

	return (
		<BoardArea className={style.team} styles={style}>
			<h2>Trolley Team</h2>
			<h3>Player:</h3>
			{playerName}
			{button}
		</BoardArea>
	);
};
