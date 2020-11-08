import React, {FunctionComponent} from 'react';
import {TrackTeam as TrackTeamT, StateTeams} from '../types';
import style from './style.module.sass'
import BoardArea from '../../../components/BoardArea';

type ParamsT = {
	team: TrackTeamT;
	teamId: keyof StateTeams;
	name: string;
	playerId: string;
	onJoinTeam: (teamId: keyof StateTeams) => void;
}

const TrackTeam: FunctionComponent<ParamsT> = ( {team, teamId, name, playerId, onJoinTeam} ) => {
	let playerNames = team.players.map(
		(player) => <li key={player}>{player}</li>
	);

	const elements: JSX.Element[] = [
		<h2 key="h2">{name} Team</h2>,
		<h3 key="h3">Players:</h3>,
		<ul key="playerList">{playerNames}</ul>
	]
	if( playerNames.length === 0 ) {
		playerNames.push(
			<li key='none'><i>None</i></li>
		);
	}

	if( team.players.indexOf(playerId) === -1 ) {
		// Player not in team
		elements.push(<button key="join" onClick={()=>onJoinTeam(teamId)}>Join</button>);
	}

	if( team.players.length === 0 ) {
		elements.push(<div key="warning">"{name} needs at least one player!"</div>);
	}

	return (
		<BoardArea className={style.team} styles={style}>
			{elements}

		</BoardArea>
	);
};

export default TrackTeam;
