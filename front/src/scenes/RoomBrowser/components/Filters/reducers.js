import {
  SET_MIN_CAPACITY,
  TOGGLE_DISPLAY_UNAVAILABLE_ROOMS,
  SELECT_ROOM_TYPE,
  SET_SEARCH_TEXT,
} from "./actions";

export default function filters(
  state = {
    minCapacity: 0,
    displayUnavailableRooms: false,
    type: "",
    searchText: "",
  },
  action,
) {
  switch (action.type) {
    case SET_MIN_CAPACITY:
      return {
        ...state,
        minCapacity: action.content,
      };
    case TOGGLE_DISPLAY_UNAVAILABLE_ROOMS:
      return {
        ...state,
        displayUnavailableRooms: !state.displayUnavailableRooms,
      };
    case SELECT_ROOM_TYPE:
      return {
        ...state,
        type: action.content,
      };
    case SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.content,
      };
    default:
      return state;
  }
}
