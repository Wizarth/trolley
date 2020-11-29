import React from 'react';
import type {FunctionComponent} from 'react';
import {useState, useContext} from 'react';
import type {LobbyAPI} from 'boardgame.io';
import {mutate} from 'swr';
import useJSONSWR from '../modules/jsonSWR';
import {useCookies} from 'react-cookie';
import {useRouter} from 'next/router';
import {UserNameContext} from './UserName';

import Spinner from 'react-spinner';
import Select from 'react-select';


interface MatchProps {
  match: LobbyAPI.Match;
}
const Match: FunctionComponent<MatchProps> = ({match}) => {
  const [cookies, setCookies] = useCookies(['playerID, credentials']);
  const router = useRouter();
  const {userName} = useContext(UserNameContext);

  const onJoin = async () => {
    // If our name is already in the match, consider this a rejoin. Otherwise,
    // try and join the first empty slot

    let playerID:number;

    let currentPlayer = match.players.find(
        (player) => player.name === userName,
    );
    if (currentPlayer) {
      if ( !cookies.credentials) {
        throw new Error('Name clash but no credentials cookie');
      }

      playerID = currentPlayer.id;
    } else {
      currentPlayer = match.players.find(
          (player) => player.name === undefined,
      );

      if (!currentPlayer) {
        throw new Error('No available slot');
      }

      playerID = currentPlayer.id;

      const response = await fetch(`/games/${match.gameName}/${match.matchID}/join`, {
        method: 'POST',
        body: JSON.stringify({
          playerID,
          playerName: userName,
        }),
        headers: {'Content-Type': 'application/json'},
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const {playerCredentials} = await response.json();
      console.log(playerCredentials);
      setCookies('credentials', playerCredentials);
    }

    // If credentials are set, playerID probably is, but we need to validate anyway?
    // Might be from old game
    setCookies('playerID', playerID);

    router.push(`/${match.gameName}/${match.matchID}`);
  };

  return (
    <div>
      <h2>{match.gameName}</h2>
      <ul>
        {match.players.map(
            ({id, name}) => <li key={id}>{name?name:<i>Available</i>}</li>,
        )}
      </ul>
      <button onClick={onJoin}>Join</button>
    </div>
  );
};


interface MatchListProps {
  gameName: string;
}

export const MatchList: FunctionComponent<MatchListProps> = ({gameName}) => {
  const {data, error} = useJSONSWR<LobbyAPI.MatchList>(`/games/${gameName}`, {refreshInterval: 1000} );

  if (error) return <div>failed to load</div>;
  if (!data) return <Spinner/>;

  const {matches} = data;

  let matchesList: JSX.Element;
  if ( matches.length ) {
    matchesList = <ul>
      {
        matches.filter(({unlisted})=>!unlisted).map(
            (match, index) => <Match match={match} key={index} />,
        )
      }
    </ul>;
  } else {
    matchesList = <span>No games</span>;
  }
  return (<>
    {matchesList}
  </>);
};

interface MatchCreatorProps {
  gameName: string;
  minPlayers: number;
  maxPlayers: number;
}

export const MatchCreator: FunctionComponent<MatchCreatorProps> = ({gameName, minPlayers, maxPlayers}) => {
  // TODO: The use of react-select here is overkill. Reacts <select> has a value attribute that does what we want.
  // It does mean construction the option elements in code, but we're constructing an array in code anyway...

  interface NumPlayerOption {
    value: number;
    label: number;
  }

  const options: NumPlayerOption[] = [];
  for ( let i = minPlayers; i <= maxPlayers; ++i ) {
    options.push({
      value: i, label: i,
    });
  }

  const [numPlayers, setNumPlayers] = useState(options[0]);

  const createMatch = async () => {
    await fetch(`/games/${gameName}/create`, {
      method: 'post',
      body: JSON.stringify({numPlayers: numPlayers.value}),
      headers: {'Content-Type': 'application/json'},
    });
    mutate(`/games/${gameName}`);
  };

  const handleChange: Select<NumPlayerOption>['onChange'] = (value) => {
    // No value selected - should be impossible, but?
    if (!value) return;
    // Multiple values selected - should be impossible, but?
    if (value instanceof Array) return;

    setNumPlayers(value);
  };

  return (
    <form onSubmit={(event)=>event.preventDefault()}>
      <label>Players:</label>
      <Select<NumPlayerOption> options={options} value={numPlayers} onChange={handleChange}/>
      <button onClick={createMatch}>Create</button>
    </form>
  );
};
