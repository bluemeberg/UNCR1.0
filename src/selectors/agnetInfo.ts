import {useSelector} from 'react-redux';
import {AgentAccountInfo} from '../@types/AgentAccountInfo';
import {RootReducer} from '../testStore';
import {UncrRootReducer} from '../uncrStore';

export const useAgentInfo = () =>
  useSelector<UncrRootReducer, AgentAccountInfo | null>(
    state => state.accountInfo.accountInfo,
  );
