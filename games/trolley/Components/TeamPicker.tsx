import React from 'react';
import TrackTeam from './TrackTeam';
import TrolleyTeam from './TrolleyTeam';
import {Player, StateTeams} from '../types';
import style from './style.module.sass';

import BoardArea from '../../../components/BoardArea';

type ParamsT = {
	teams: StateTeams;
	playerId: string;
	player: Player;
	onJoinTeam: (teamId: keyof StateTeams) => void;
	onDone: () => void;
}
export default function TeamPicker( {teams, player, playerId, onJoinTeam, onDone} : ParamsT ) {
	let buttonDisabled = !player.team;
	let buttonLabel = "Ready";
	if(player.teamsDone) {
		buttonLabel += "!";
	} else {
		buttonLabel += "?";
	}

	return (
		<div>
			<h1>Choose your team</h1>
			<BoardArea className={style.teamListArea} styles={style}>
				<div className={style.listElements}>
					<TrackTeam team={teams.north} teamId="north" name="North" playerId={playerId} onJoinTeam={onJoinTeam}/>
					<TrackTeam team={teams.south} teamId="south" name="South" playerId={playerId} onJoinTeam={onJoinTeam}/>
					<TrolleyTeam team={teams.conductor} teamId="conductor" playerId={playerId} onJoinTeam={onJoinTeam}/>
				</div>
			</BoardArea>
			<button disabled={buttonDisabled} onClick={onDone}>{buttonLabel}</button>
		</div>
	);
}
