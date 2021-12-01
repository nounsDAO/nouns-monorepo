import { createBrowserHistory, History } from 'history';
import { applyMiddleware, combineReducers, createStore, PreloadedState } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import account from './state/slices/account';
import application from './state/slices/application';
import auction from './state/slices/auction';
import logs from './state/slices/logs';
import pastAuctions from './state/slices/pastAuctions';
import onDisplayAuction from './state/slices/onDisplayAuction';
import { composeWithDevTools } from 'redux-devtools-extension';

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    application,
    auction,
    logs,
    pastAuctions,
    onDisplayAuction,
  });

export default function configureStore(preloadedState: PreloadedState<any>) {
  return createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
      ),
    ),
  );
}
