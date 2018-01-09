import {
  SELECT_ROOM_TO_BOOK,
  SET_EVENT_NAME,
  ATTEMPT_BOOK_CONFIRM,
  REQUEST_BOOK,
  RECEIVE_BOOK_CONFIRMATION,
  RECEIVE_BOOK_UNKNOWN_ERROR,
  RECEIVE_ROOM_ALREADY_BOOKED_ERROR,
  RECEIVE_FAILED_BECAUSE_MISSING_EMAIL_ERROR,
} from "./actions";

export default function book(
  state = {
    room: null,
    eventName: "",
    requestSent: false,
    isFetching: false,
    success: false,
    failedBecauseAlreadyBooked: false,
    failedBecauseMissingEmail: false,
    attemptedConfirm: false,
  },
  action,
) {
  switch (action.type) {
    case SELECT_ROOM_TO_BOOK:
      // Reset all params here
      return {
        ...state,
        room: action.content,
        eventName: "",
        requestSent: false,
        isFetching: false,
        success: false,
        failedBecauseAlreadyBooked: false,
        failedBecauseMissingEmail: false,
        attemptedConfirm: false,
      };
    case SET_EVENT_NAME:
      return {
        ...state,
        eventName: action.content,
      };
    case ATTEMPT_BOOK_CONFIRM:
      return {
        ...state,
        attemptedConfirm: true,
      };
    case REQUEST_BOOK:
      return {
        ...state,
        requestSent: true,
        isFetching: true,
      };
    case RECEIVE_BOOK_CONFIRMATION:
      return {
        ...state,
        isFetching: false,
        success: true,
      };
    case RECEIVE_BOOK_UNKNOWN_ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        failedBecauseAlreadyBooked: false,
      };
    case RECEIVE_ROOM_ALREADY_BOOKED_ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        failedBecauseAlreadyBooked: true,
      };
    case RECEIVE_FAILED_BECAUSE_MISSING_EMAIL_ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        failedBecauseMissingEmail: true,
      };
    default:
      return state;
  }
}
