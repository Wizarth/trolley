import React from 'react';
import {TrolleyTeam as TrolleyTeamT} from './types';
import style from './style.module.scss';

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
	}
	if( team.player !== playerId) {
		// Player not in team
		button = <button onClick={()=>onJoinTeam('trolley')}>Join</button>
	} else {
		playerName = <div><span>{playerId}</span></div>
		button = null;
	}

	return (
		<div className={style.team}>
			<h2>Trolley Team</h2>
			{playerName}
			{button}
		</div>
	);
};
