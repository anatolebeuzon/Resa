import authenticatedFetch from "../../../../services/authenticatedFetch";
import { forceFetchBookings } from "../BookingsList/actions";
import { forceFetchRooms } from "../../../RoomBrowser/components/RoomList/actions";

export const OPEN_CANCEL_MODAL = "OPEN_CANCEL_MODAL";
export const REQUEST_CANCEL = "REQUEST_CANCEL";
export const RECEIVE_CANCEL_CONFIRMATION = "RECEIVE_CANCEL_CONFIRMATION";
export const RECEIVE_CANCEL_ERROR = "RECEIVE_CANCEL_ERROR";

export function openCancelModal(eventId) {
  return {
    type: OPEN_CANCEL_MODAL,
    eventId,
  };
}

function requestCancel() {
  return {
    type: REQUEST_CANCEL,
  };
}

function receiveCancelConfirmation() {
  return {
    type: RECEIVE_CANCEL_CONFIRMATION,
  };
}

function receiveCancelError() {
  return {
    type: RECEIVE_CANCEL_ERROR,
  };
}

export function sendCancelRequest(eventId) {
  return async dispatch => {
    dispatch(requestCancel());

    let error;
    try {
      await authenticatedFetch("book/cancel", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });
    } catch (e) {
      error = true;
    }

    if (error) {
      dispatch(receiveCancelError());
    } else {
      dispatch(receiveCancelConfirmation());
      dispatch(forceFetchBookings());
      dispatch(forceFetchRooms());
    }
  };
}
