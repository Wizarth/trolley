import styles from './style.module.scss'

import React from 'react';
import TeamPicker from './TeamPicker';
import { BoardProps } from 'boardgame.io/react';
import {State} from './types';

export class TrolleyGameBoard extends React.Component<BoardProps<State>> {

	onJoinTeam(teamId: string) {
		this.props.moves.chooseTeam(teamId);
	}
	onJoinTeamDone() {
		this.props.moves.toggleDone();
	}
	render() {
		let elementList: JSX.Element[] = [];
		if( this.props.ctx.phase === 'setup' && this.props.ctx.activePlayers[this.props.ctx.currentPlayer] === 'pickTeam') {
			elementList.push(
				<TeamPicker
					teams={this.props.G.teams}
					playerId={this.props.playerID}
					onJoinTeam={(teamId)=>this.onJoinTeam(teamId)}
					onDone={()=>this.onJoinTeamDone()}
				/>
			)
		}
		elementList.push(
			<div>Board goes here</div>
		)
		return (
			<div className={styles.board}>
				{elementList}
			</div>
		);
	}
}
