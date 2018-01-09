import authenticatedFetch from "../../../../services/authenticatedFetch";
import getFormattedDate from "../../../../services/getFormattedDate";
import { forceFetchRooms } from "../RoomList/actions";
import { forceFetchBookings } from "../../../MyBookings/components/BookingsList/actions";

export const SELECT_ROOM_TO_BOOK = "SELECT_ROOM_TO_BOOK";
export const SET_EVENT_NAME = "SET_EVENT_NAME";
export const ATTEMPT_BOOK_CONFIRM = "ATTEMPT_BOOK_CONFIRM";
export const REQUEST_BOOK = "REQUEST_BOOK";
export const RECEIVE_BOOK_CONFIRMATION = "RECEIVE_BOOK_CONFIRMATION";
export const RECEIVE_BOOK_UNKNOWN_ERROR = "RECEIVE_BOOK_UNKNOWN_ERROR";
export const RECEIVE_ROOM_ALREADY_BOOKED_ERROR =
  "RECEIVE_ROOM_ALREADY_BOOKED_ERROR";
export const RECEIVE_FAILED_BECAUSE_MISSING_EMAIL_ERROR =
  "RECEIVE_FAILED_BECAUSE_MISSING_EMAIL_ERROR";

export function selectRoomToBook(room) {
  return {
    type: SELECT_ROOM_TO_BOOK,
    content: room
  };
}

export function setEventName(eventName) {
  return {
    type: SET_EVENT_NAME,
    content: eventName
  };
}

function attemptBookConfirm() {
  return {
    type: ATTEMPT_BOOK_CONFIRM
  };
}

function requestBook() {
  return {
    type: REQUEST_BOOK
  };
}

function receiveBookConfirmation() {
  return {
    type: RECEIVE_BOOK_CONFIRMATION
  };
}

function receiveBookUnknownError() {
  return {
    type: RECEIVE_BOOK_UNKNOWN_ERROR
  };
}

function receiveRoomAlreadyBookedError() {
  return {
    type: RECEIVE_ROOM_ALREADY_BOOKED_ERROR
  };
}

function receiveFailedBecauseMissingEmailError() {
  return {
    type: RECEIVE_FAILED_BECAUSE_MISSING_EMAIL_ERROR
  };
}

export function sendBookRequest() {
  return async (dispatch, getState) => {
    dispatch(attemptBookConfirm());

    const state = getState();
    const { room, eventName } = state.roomBrowser.book;
    const {
      selectedDate,
      selectedStartTime,
      selectedEndTime
    } = state.roomBrowser.dateTime;
    const formattedDate = getFormattedDate(
      selectedDate,
      selectedStartTime,
      selectedEndTime
    );

    // Do nothing if eventName is empty
    if (!eventName) return;

    dispatch(requestBook());

    let unknownError;
    let data;
    try {
      data = await authenticatedFetch("book/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          eventName,
          startDate: formattedDate.start,
          endDate: formattedDate.end,
          roomId: room.id
        })
      });
    } catch (e) {
      unknownError = true;
    }

    if (unknownError) {
      dispatch(receiveBookUnknownError());
    } else if (data.failedBecauseMissingEmail) {
      dispatch(receiveFailedBecauseMissingEmailError());
    } else if (data.failedBecauseAlreadyBooked) {
      dispatch(receiveRoomAlreadyBookedError());
    } else {
      // Success !
      dispatch(receiveBookConfirmation());

      // Reload available rooms
      dispatch(forceFetchRooms());

      // Preload or reload MyBookings
      dispatch(forceFetchBookings());
    }
  };
}
