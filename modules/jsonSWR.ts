import useSWR from 'swr';
import {keyInterface, ConfigInterface, responseInterface} from 'swr/esm/types';

const fetcher = (arg: RequestInfo, init?: RequestInit) => fetch(arg, init).then((res) => res.json());

/*
  Maybe this could be done use Parameters<typeof useSWR>, ReturnType<typeof useSWR> but something about
  this file is giving my editor the conniptions.
*/
function useJSONSWR<Data, Error = any>(key: keyInterface): responseInterface<Data, Error>;
function useJSONSWR<Data, Error = any>(key: keyInterface, config: ConfigInterface<Data, Error>): responseInterface<Data, Error>;
function useJSONSWR<Data, Error = any>(key: keyInterface, config?: ConfigInterface<Data, Error>): responseInterface<Data, Error> {
  return useSWR<Data, Error>(key, fetcher, config);
}

export default useJSONSWR;
