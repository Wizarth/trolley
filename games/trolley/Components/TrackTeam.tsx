import React from 'react';
import {TrackTeam as TrackTeamT, StateTeams} from '../types';
import style from './style.module.sass'
import BoardArea from '../../../components/BoardArea';

type ParamsT = {
	team: TrackTeamT;
	teamId: keyof StateTeams;
	name: string;
	playerId: string;
	onJoinTeam: (teamId: string) => void;
}

export default function TrackTeam( {team, teamId, name, playerId, onJoinTeam}: ParamsT ) {
	let playerNames = team.players.map(
		(player) => <li key={player}>{player}</li>
	);
	if( playerNames.length === 0 ) {
		playerNames.push(
			<li key='none'><i>None</i></li>
		);
	}

	let button: JSX.Element;

	if( team.players.indexOf(playerId) === -1 ) {
		// Player not in team
		button = <button onClick={()=>onJoinTeam(teamId)}>Join</button>
	} else {
		button = null;
	}

	let warning: JSX.Element;
	if( team.players.length === 0 ) {
		warning = <div>"{name} needs at least one player!"</div>;
	}

	return (
		<BoardArea className={style.team} styles={style}>
			<h2>{name} Team</h2>
			<h3>Players:</h3>
			<ul>{playerNames}</ul>
			{button}
			{warning}
		</BoardArea>
	);
};
