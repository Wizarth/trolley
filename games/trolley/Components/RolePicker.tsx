import BoardArea from '../../../components/BoardArea';
import styles from './style.module.sass';
import {Player, TrackTeam, TrackTeamRoles} from '../types';

type RoleEvent = (role: keyof TrackTeamRoles) => void
type ParamsT = {
  team: TrackTeam;
  player: Player;
  onJoinRole: RoleEvent;
  onLeaveRole: RoleEvent;
	onDone: () => void;
}

/** Helper to convert onchange to join/leave */
function onChange(
  event: React.ChangeEvent<HTMLInputElement>,
  role: keyof TrackTeamRoles,
  onJoin: RoleEvent,
  onLeave: RoleEvent
) {
  if(event.target.checked) {
    onJoin(role);
  } else {
    onLeave(role)
  }
}

function generateModifierList(team:TrackTeam, onJoinRole: RoleEvent, onLeaveRole: RoleEvent) {
  return team.players.map(
    (playerId) => <span>
        <input type="checkbox"
          name={playerId}
          checked={team.roles.modifier.indexOf(playerId) !== -1}
          onChange={(event) => onChange(event, 'modifier', onJoinRole, onLeaveRole)}
          />
        <label>{playerId}</label>
      </span>
  )
}

function generateRadioList(team:TrackTeam, role: "innocent"|"guilty", onJoinRole: RoleEvent, onLeaveRole: RoleEvent) {
  return team.players.map(
    (playerId) => <span>
        <input type="radio"
          name={role}
          checked={team.roles[role] === playerId}
          onChange={(event) => onChange(event, role, onJoinRole, onLeaveRole)}
          />
        <label>{playerId}</label>
      </span>
  )
}

export default function RolePicker({team, player, onJoinRole, onLeaveRole, onDone} : ParamsT) {
  const innocentList = generateRadioList(
    team,
    "innocent",
    onJoinRole,
    onLeaveRole
  );
  const guiltyList = generateRadioList(
    team,
    "guilty",
    onJoinRole,
    onLeaveRole
  );
  const modifierList = generateModifierList(
    team,
    onJoinRole,
    onLeaveRole
  );
  let buttonDisabled = false;

  let innocentWarning: JSX.Element|undefined;
  if(!team.roles.innocent ) {
    innocentWarning = <span>Role requires a player</span>
    buttonDisabled = true;
  }
  let guiltyWarning: JSX.Element|void;
  if(!team.roles.guilty ) {
    guiltyWarning = <span>Role requires a player</span>
    buttonDisabled = true;
  }
  let modifierWarning: JSX.Element|void;
  if(team.roles.modifier.length === 0 ) {
    modifierWarning = <span>Role requires at least one player</span>
    buttonDisabled = true;
  }

  let buttonLabel = "Ready";
  if(player.rolesDone) {
    buttonLabel += "!";
  } else {
    buttonLabel += "?";
  }
  <button disabled={buttonDisabled} onClick={onDone}>{buttonLabel}</button>

  return (
    <div>
      <h1>Choose your roles</h1>
      <BoardArea className={styles.roleListArea} styles={styles}>
        <div className={styles.listElements}>
          <BoardArea className={styles.role} styles={styles}>
            <h2>Innocent</h2>
            <form>
              {innocentList}
            </form>
            <>{innocentWarning}</>
          </BoardArea>
          <BoardArea className={styles.role} styles={styles}>
            <h2>Guilty</h2>
            <form>
              {guiltyList}
            </form>
            <>{guiltyWarning}</>
          </BoardArea>
          <BoardArea className={styles.role} styles={styles}>
            <h2>Modifier</h2>
            <form>
              {modifierList}
            </form>
            <>{modifierWarning}</>
          </BoardArea>
        </div>
      </BoardArea>
      <button disabled={buttonDisabled} onClick={()=>onDone()}>{buttonLabel}</button>
    </div>
  )
}
