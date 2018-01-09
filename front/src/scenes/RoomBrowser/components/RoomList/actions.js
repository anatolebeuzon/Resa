import authenticatedFetch from "../../../../services/authenticatedFetch";
import getFormattedDate from "../../../../services/getFormattedDate";

export const INVALIDATE_ROOMS = "INVALIDATE_ROOMS";
export const REQUEST_ROOMS = "REQUEST_ROOMS";
export const RECEIVE_ROOMS = "RECEIVE_ROOMS";
export const RECEIVE_ROOMS_FETCHING_ERROR = "RECEIVE_ROOMS_FETCHING_ERROR";

function invalidateRooms() {
  return {
    type: INVALIDATE_ROOMS
  };
}

function requestRooms(selectedDate, selectedStartTime, selectedEndTime) {
  return {
    type: REQUEST_ROOMS,
    selectedDate: new Date(selectedDate),
    selectedStartTime: selectedStartTime.clone(),
    selectedEndTime: selectedEndTime.clone()
  };
}

function receiveRooms(listOfRooms) {
  return {
    type: RECEIVE_ROOMS,
    items: listOfRooms
  };
}

function receiveRoomsFetchingError() {
  return {
    type: RECEIVE_ROOMS_FETCHING_ERROR
  };
}

function fetchRooms() {
  return async (dispatch, getState) => {
    const {
      selectedDate,
      selectedStartTime,
      selectedEndTime
    } = getState().roomBrowser.dateTime;

    dispatch(requestRooms(selectedDate, selectedStartTime, selectedEndTime));

    const formattedDate = getFormattedDate(
      selectedDate,
      selectedStartTime,
      selectedEndTime
    );

    let error;
    let data;
    try {
      data = await authenticatedFetch(
        `search/available/${formattedDate.start}/${formattedDate.end}`
      );
    } catch (e) {
      error = true;
    }

    if (error) {
      dispatch(receiveRoomsFetchingError());
    } else {
      dispatch(receiveRooms(data));
    }
  };
}

function shouldFetchRooms(state) {
  const bookings = state.roomBrowser.list;
  if (bookings.isFetching) {
    return false;
  } else if (bookings.needsReload) {
    return true;
  }

  const {
    lastFetchSelectedDate,
    lastFetchSelectedStartTime,
    lastFetchSelectedEndTime
  } = bookings;
  const {
    selectedDate,
    selectedStartTime,
    selectedEndTime
  } = state.roomBrowser.dateTime;

  // Compare currently selected date&time with date&time used for last fetch:
  if (
    Number(lastFetchSelectedDate) === Number(selectedDate) &&
    lastFetchSelectedStartTime.isSame(selectedStartTime) &&
    lastFetchSelectedEndTime.isSame(selectedEndTime)
  ) {
    return false;
  }
  return true;
}

export function fetchRoomsIfNeeded() {
  // eslint-disable-next-line
  return (dispatch, getState) => {
    if (shouldFetchRooms(getState())) {
      return dispatch(fetchRooms());
    }
  };
}

export function forceFetchRooms() {
  return async dispatch => {
    dispatch(invalidateRooms());
    dispatch(fetchRoomsIfNeeded());
  };
}
