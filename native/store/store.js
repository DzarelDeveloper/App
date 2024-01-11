import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import mainReducers from './reducer/mainReducers';
import thunk from 'redux-thunk';

export const st = createStore(mainReducers, composeWithDevTools(applyMiddleware(thunk)));
