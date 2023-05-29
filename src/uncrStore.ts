import {applyMiddleware, combineReducers, createStore} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import {
  accountInfoReducer,
  TypeAgentAccountReducer,
} from './reducers/agentAccount';
import {
  mainFeedListReducer,
  TypeMainFeedReducer,
} from './reducers/mainFeedList';
import {
  guestInfoReducer,
  TypeGuestAccountReducer,
} from './reducers/guestAccount';
import {googleUserReducer, TypeGoogleUserReducer} from './reducers/googleUser';
import {
  agentFeedListReducer,
  TypeAgentFeedReducer,
} from './reducers/agentFeedList';
import {myFeedReducer, TypeMyFeedReducer} from './reducers/myFeedList';

const rootReducer = combineReducers({
  accountInfo: accountInfoReducer,
  mainFeedList: mainFeedListReducer,
  guestInfo: guestInfoReducer,
  googleUser: googleUserReducer,
  agentFeedList: agentFeedListReducer,
  myFeedList: myFeedReducer,
});

export const uncrStore = createStore(
  rootReducer,
  applyMiddleware(thunk, logger),
);

export type UncrRootReducer = {
  accountInfo: TypeAgentAccountReducer;
  mainFeedList: TypeMainFeedReducer;
  guestInfo: TypeGuestAccountReducer;
  googleUser: TypeGoogleUserReducer;
  agentFeedList: TypeAgentFeedReducer;
  myFeedList: TypeMyFeedReducer;
};
