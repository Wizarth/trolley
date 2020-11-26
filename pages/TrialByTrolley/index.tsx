import type {FunctionComponent} from 'react';

import {UserNameContext, useUserName, UserName} from '../../components/UserName'
import {MatchList, MatchCreator} from '../../components/MatchList';

import {TrolleyGame} from '../../games/trolley';

const name = TrolleyGame.name!;
const {
  minPlayers,
  maxPlayers
} = TrolleyGame;

const TrolleyGameIndexPage: FunctionComponent = () => {
  const userNameConextValue = useUserName();

  return (
    <UserNameContext.Provider value={userNameConextValue}>
      <UserName/>
      <h1>{name} Matches</h1>
      <MatchList gameName={name} />
      <h1>Create match</h1>
      <MatchCreator gameName={name} minPlayers={minPlayers} maxPlayers={maxPlayers} />
    </UserNameContext.Provider>
  )
}

export default TrolleyGameIndexPage;
