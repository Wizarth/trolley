import React, {FunctionComponent} from 'react';
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
const TeamPicker: FunctionComponent<ParamsT> = ( {teams, player, playerId, onJoinTeam, onDone} ) => {
	let buttonDisabled = !player.team;
	let buttonLabel = "Ready";
	if(player.teamsDone) {
		buttonLabel += "!";
	} else {
		buttonLabel += "?";
	}

	// Button onClick using a lambda to discard the event param and not pass it to onDone
	return (
		<div>
			<h1>Choose your team</h1>
			<BoardArea className={style.teamListArea} styles={style}>
				<div className={style.listElements}>
					<TrackTeam key="north" team={teams.north} teamId="north" name="North" playerId={playerId} onJoinTeam={onJoinTeam}/>
					<TrackTeam key="south" team={teams.south} teamId="south" name="South" playerId={playerId} onJoinTeam={onJoinTeam}/>
					<TrolleyTeam key="conductor" team={teams.conductor} teamId="conductor" playerId={playerId} onJoinTeam={onJoinTeam}/>
				</div>
			</BoardArea>
			<button disabled={buttonDisabled} onClick={()=>onDone()}>{buttonLabel}</button>
		</div>
	);
}

export default TeamPicker;
