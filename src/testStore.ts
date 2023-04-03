import {applyMiddleware, combineReducers, createStore} from 'redux';
import {feedListReducer, TypeFeedListReducer} from './reducers/test/feedList';
import {TypeUserInfoReducer, userInfoReducer} from './reducers/test/userInfo';
import thunk from 'redux-thunk';
const rootReducer = combineReducers({
  userInfo: userInfoReducer,
  feedList: feedListReducer,
});

export const testStore = createStore(rootReducer, applyMiddleware(thunk));

export type RootReducer = {
  userInfo: TypeUserInfoReducer;
  feedList: TypeFeedListReducer;
};
