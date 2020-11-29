import React from 'react';
import type {FunctionComponent} from 'react';
import {useCookies} from 'react-cookie';
import {createContext, useState, useContext} from 'react';

import EdiText from 'react-editext';


interface UserNameContextData {
  userName: string;
  setUserName: (name: string) => void
};

export const UserNameContextDefault = {
  userName: '',
  setUserName() {},
};

export const UserNameContext = createContext<UserNameContextData>(UserNameContextDefault);

export function useUserName(): UserNameContextData {
  const [userName, setUserNameState] = useState('Visitor');
  const [cookies, setCookie] = useCookies(['username']);

  if (cookies.username !== userName) {
    setUserNameState(cookies.username);
  }

  return {userName, setUserName(name) {
    // TODO: Handle updating the player name when the player is in a match
    // POST /games/{gameName}/{matchID}/update with playerID, credentials, newName
    setCookie('username', name);
    setUserNameState(name);
  }};
}

export const UserName: FunctionComponent = () => {
  const {userName, setUserName} = useContext(UserNameContext);

  return ( <span>
    <label>Username:</label>
    <EdiText type='text' value={userName} onSave={setUserName} />
  </span>
  );
};
