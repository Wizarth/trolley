import React, {FunctionComponent} from 'react';
import {TrolleyTeam as TrolleyTeamT, StateTeams} from '../types';
import style from './style.module.sass';
import BoardArea from '../../../components/BoardArea';


type ParamsT = {
	team: TrolleyTeamT;
	teamId: "conductor";
	playerId: string;
	onJoinTeam: (teamId: keyof StateTeams) => void;
}

const TrolleyTeam: FunctionComponent<ParamsT> = ( {team, playerId, onJoinTeam} ) => {
	const elements: JSX.Element[] = [
		<h2 key='h2'>Conductor</h2>,
		<h3 key='h3'>Player:</h3>
	]
	if( team.player === null ) {
		elements.push(
			<div key='player'><i>None</i></div>
		);
	} else {
		elements.push(<div key='player'><span>{team.player}</span></div>);
	}
	if( team.player !== playerId) {
		// Player not in team
		elements.push(<button key='join' onClick={()=>onJoinTeam('conductor')}>Join</button>);
	}
	if( team.player === null ) {
		elements.push(
			<div key='warning'>"Conductor needs a player!"</div>
		);
	}

	return (
		<BoardArea className={style.team} styles={style}>
			{elements}
		</BoardArea>
	);
};

export default TrolleyTeam
