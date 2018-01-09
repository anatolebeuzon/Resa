import authenticatedFetch from "../../../../services/authenticatedFetch";

export const TOGGLE_PAST_BOOKINGS = "TOGGLE_PAST_BOOKINGS";
export const SHOW_MORE_PAST_BOOKINGS = "SHOW_MORE_PAST_BOOKINGS";
export const INVALIDATE_BOOKINGS = "INVALIDATE_BOOKINGS";
export const REQUEST_BOOKINGS = "REQUEST_BOOKINGS";
export const RECEIVE_BOOKINGS = "RECEIVE_BOOKINGS";
export const RECEIVE_BOOKINGS_FETCHING_ERROR =
  "RECEIVE_BOOKINGS_FETCHING_ERROR";

export function togglePastBookings() {
  return {
    type: TOGGLE_PAST_BOOKINGS,
  };
}

export function showMorePastBookings() {
  return {
    type: SHOW_MORE_PAST_BOOKINGS,
  };
}

function invalidateBookings() {
  return {
    type: INVALIDATE_BOOKINGS,
  };
}

function requestBookings() {
  return {
    type: REQUEST_BOOKINGS,
  };
}

function receiveBookings(listOfBookings) {
  return {
    type: RECEIVE_BOOKINGS,
    items: listOfBookings,
  };
}

function receiveBookingsFetchingError() {
  return {
    type: RECEIVE_BOOKINGS_FETCHING_ERROR,
  };
}

function fetchBookings() {
  return async dispatch => {
    dispatch(requestBookings());

    let error;
    let data;
    try {
      data = await authenticatedFetch("book/list");
    } catch (e) {
      error = true;
    }

    if (error) {
      dispatch(receiveBookingsFetchingError());
    } else {
      dispatch(receiveBookings(data.eventList));
    }
  };
}

function shouldFetchBookings(state) {
  const bookings = state.myBookings.list;
  if (bookings.isFetching) {
    return false;
  }
  return bookings.needsReload;
}

export function fetchBookingsIfNeeded() {
  // eslint-disable-next-line
  return (dispatch, getState) => {
    if (shouldFetchBookings(getState())) {
      return dispatch(fetchBookings());
    }
  };
}

export function forceFetchBookings() {
  return async dispatch => {
    dispatch(invalidateBookings());
    dispatch(fetchBookingsIfNeeded());
  };
}
