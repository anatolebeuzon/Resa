export const SET_MIN_CAPACITY = "SET_MIN_CAPACITY";
export const TOGGLE_DISPLAY_UNAVAILABLE_ROOMS =
  "TOGGLE_DISPLAY_UNAVAILABLE_ROOMS";
export const SELECT_ROOM_TYPE = "SELECT_ROOM_TYPE";
export const SET_SEARCH_TEXT = "SET_SEARCH_TEXT";

export function setMinCapacity(minCapacity) {
  return {
    type: SET_MIN_CAPACITY,
    content: minCapacity,
  };
}

export function toggleDisplayUnavailableRooms() {
  return {
    type: TOGGLE_DISPLAY_UNAVAILABLE_ROOMS,
  };
}

export function selectRoomType(roomType) {
  return {
    type: SELECT_ROOM_TYPE,
    content: roomType,
  };
}

export function setSearchText(searchText) {
  return {
    type: SET_SEARCH_TEXT,
    content: searchText,
  };
}
