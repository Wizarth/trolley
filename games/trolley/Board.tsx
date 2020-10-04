import styles from './Components/style.module.sass'

import React from 'react';
import TeamPicker from './Components/TeamPicker';
import RolePicker from './Components/RolePicker';
import { BoardProps } from 'boardgame.io/react';
import {State} from './types';

export class TrolleyGameBoard extends React.Component<BoardProps<State>> {

	onJoinTeam(teamId: string) {
		this.props.moves.chooseTeam(teamId);
	}
	render() {
		if(this.props.playerID === null) {
			throw new Error("playerID null");
		}
		if(this.props.ctx.activePlayers === null ) {
			// This happens when leaving a phase?
			// throw new Error("activePlayers null")
			return null;
		}
		const interactingPlayer = this.props.G.players[this.props.playerID];
		if(!interactingPlayer) {
			throw new Error("interacting player null");
		}

		let elementList: JSX.Element[] = [];
		if( this.props.ctx.phase === 'setup' ){
			switch( this.props.ctx.activePlayers[this.props.playerID] ) {
				case 'pickTeam':
					elementList.push(
						<TeamPicker
							teams={this.props.G.teams}
							player={interactingPlayer}
							playerId={this.props.playerID}
							onJoinTeam={(teamId)=>this.onJoinTeam(teamId)}
							onDone={()=>this.props.moves.toggleDone()}
						/>
					);
					break;
				case 'pickRole':
					const curTeam = interactingPlayer.team;
					if(curTeam === "north" || curTeam === "south") {
						elementList.push(
							<RolePicker
								team={this.props.G.teams[curTeam]}
								player={interactingPlayer}
								onJoinRole={(role)=>this.props.moves.joinRole(role)}
								onLeaveRole={(role)=>this.props.moves.leaveRole(role)}
								onDone={()=>this.props.moves.toggleDone()}
							/>
						);
					}
					break;
				default:
					elementList.push(
						<h1>Please wait...</h1>
					);
			}
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
