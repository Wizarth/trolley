import React from 'react';
import TrackTeam from './TrackTeam';
import TrolleyTeam from './TrolleyTeam';
import {StateTeams} from './types';
import style from './style.module.sass';

import BoardArea from '../../components/BoardArea';

type ParamsT = {
	teams: StateTeams;
	playerId: string;
	onJoinTeam: (teamId: string) => void;
	onDone: () => void;
}
export default function TeamPicker( {teams, playerId, onJoinTeam, onDone} : ParamsT ) {
	return (
		<div>
			<h1>Choose your team</h1>
			<BoardArea className={style.teamListArea} styles={style}>
				<div className={style.teamListElements}>
					<TrackTeam team={teams.top} teamId="top" name="Top" playerId={playerId} onJoinTeam={onJoinTeam}/>
					<TrackTeam team={teams.bottom} teamId="bottom" name="Bottom" playerId={playerId} onJoinTeam={onJoinTeam}/>
					<TrolleyTeam team={teams.trolley} teamId="trolley" playerId={playerId} onJoinTeam={onJoinTeam}/>
				</div>
			</BoardArea>
			<button onClick={onDone}>Ready</button>
		</div>
	);
}
