import React from 'react';
import {TrolleyTeam as TrolleyTeamT, StateTeams} from '../types';
import style from './style.module.sass';
import BoardArea from '../../../components/BoardArea';


type ParamsT = {
	team: TrolleyTeamT;
	teamId: "conductor";
	playerId: string;
	onJoinTeam: (teamId: keyof StateTeams) => void;
}

export default function TrolleyTeam( {team, playerId, onJoinTeam}: ParamsT ){
	let playerName: JSX.Element;
	let button: JSX.Element;

	let warning: JSX.Element;
	if( team.player === null ) {
		playerName = <div><i>None</i></div>
		warning = <div>"Conductor needs a player!"</div>;
	} else {
		playerName = <div><span>{team.player}</span></div>
	}
	if( team.player !== playerId) {
		// Player not in team
		button = <button onClick={()=>onJoinTeam('conductor')}>Join</button>
	}

	return (
		<BoardArea className={style.team} styles={style}>
			<h2>Conductor</h2>
			<h3>Player:</h3>
			{playerName}
			{button}
			{warning}
		</BoardArea>
	);
};
