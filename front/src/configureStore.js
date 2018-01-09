import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";

import myBookings from "./scenes/MyBookings/reducers";
import roomBrowser from "./scenes/RoomBrowser/reducers";

const rootReducer = combineReducers({
  roomBrowser,
  myBookings,
});

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middlewares),
  );
}
