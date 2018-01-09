import { combineReducers } from "redux";

import {
  NO_DIRECT_LINK,
  SET_ROOM_ID,
  REQUEST_ROOM_DETAIL,
  RECEIVE_ROOM_DETAIL,
  RECEIVE_ROOM_DETAIL_FETCHING_ERROR,
  TOGGLE_ACTION_SELECTOR,
  REQUEST_ROOM_AGENDA,
  RECEIVE_ROOM_AGENDA,
  RECEIVE_ROOM_AGENDA_FETCHING_ERROR
} from "./actions";

function actionSelector(
  state = {
    displayActionSelector: true,
    isFetching: false,
    errorWhileFetching: null,
    // When loading the page, it is assumed that there may be a direct link to a room
    // If it is confirmed that there is none, noDirectLink will be changed to 'true'
    noDirectLink: false,
    roomId: null,
    room: null
  },
  action
) {
  switch (action.type) {
    case NO_DIRECT_LINK:
      return {
        ...state,
        noDirectLink: true,
        roomId: null,
        room: null
      };
    case SET_ROOM_ID:
      return {
        ...state,
        roomId: action.roomId
      };
    case REQUEST_ROOM_DETAIL:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_ROOM_DETAIL:
      return {
        ...state,
        isFetching: false,
        errorWhileFetching: false,
        room: action.room
      };
    case RECEIVE_ROOM_DETAIL_FETCHING_ERROR:
      return {
        ...state,
        isFetching: false,
        errorWhileFetching: true
      };
    case TOGGLE_ACTION_SELECTOR:
      return {
        ...state,
        displayActionSelector: !state.displayActionSelector
      };
    default:
      return state;
  }
}

function roomAgenda(
  state = {
    isFetching: false,
    errorWhileFetching: false,
    success: false
  },
  action
) {
  switch (action.type) {
    case REQUEST_ROOM_AGENDA:
      return {
        ...state,
        isFetching: true,
        errorWhileFetching: false,
        success: false
      };
    case RECEIVE_ROOM_AGENDA:
      return {
        ...state,
        isFetching: false,
        success: true
      };
    case RECEIVE_ROOM_AGENDA_FETCHING_ERROR:
      return {
        ...state,
        isFetching: false,
        errorWhileFetching: true,
        success: false
      };
    default:
      return state;
  }
}

const directLinkHandler = combineReducers({
  actionSelector,
  roomAgenda
});

export default directLinkHandler;
