import authenticatedFetch from "../../../../services/authenticatedFetch";
import { forceFetchBookings } from "../BookingsList/actions";
import { forceFetchRooms } from "../../../RoomBrowser/components/RoomList/actions";

export const INITIALIZE_MODIF_MODAL = "INITIALIZE_MODIF_MODAL";
export const SET_NAME_OF_MODIFIED_EVENT = "SET_NAME_OF_MODIFIED_EVENT";
export const SET_START_HOUR_OF_MODIFIED_EVENT =
  "SET_START_HOUR_OF_MODIFIED_EVENT";
export const SET_START_MINUTES_OF_MODIFIED_EVENT =
  "SET_START_MINUTES_OF_MODIFIED_EVENT";
export const SET_END_HOUR_OF_MODIFIED_EVENT = "SET_END_HOUR_OF_MODIFIED_EVENT";
export const SET_END_MINUTES_OF_MODIFIED_EVENT =
  "SET_END_MINUTES_OF_MODIFIED_EVENT";
export const SET_ROOM_ID_OF_MODIFIED_EVENT = "SET_ROOM_ID_OF_MODIFIED_EVENT";
export const ATTEMPT_MODIF_CONFIRM = "ATTEMPT_MODIF_CONFIRM";
export const REQUEST_MODIF = "REQUEST_MODIF";
export const RECEIVE_MODIF_CONFIRMATION = "RECEIVE_MODIF_CONFIRMATION";
export const RECEIVE_MODIF_UNKNOWN_ERROR = "RECEIVE_MODIF_UNKNOWN_ERROR";
export const RECEIVE_MODIF_ALREADY_BOOKED_ERROR =
  "RECEIVE_MODIF_ALREADY_BOOKED_ERROR";

export function initializeModifModal(event, modifType) {
  return {
    type: INITIALIZE_MODIF_MODAL,
    event,
    modifType,
  };
}

export function setNameOfModifiedEvent(newName) {
  return {
    type: SET_NAME_OF_MODIFIED_EVENT,
    newName,
  };
}

export function setStartHourOfModifiedEvent(newStartHour) {
  return {
    type: SET_START_HOUR_OF_MODIFIED_EVENT,
    newStartHour,
  };
}

export function setStartMinutesOfModifiedEvent(newStartMinutes) {
  return {
    type: SET_START_MINUTES_OF_MODIFIED_EVENT,
    newStartMinutes,
  };
}

export function setEndHourOfModifiedEvent(newEndHour) {
  return {
    type: SET_END_HOUR_OF_MODIFIED_EVENT,
    newEndHour,
  };
}

export function setEndMinutesOfModifiedEvent(newEndMinutes) {
  return {
    type: SET_END_MINUTES_OF_MODIFIED_EVENT,
    newEndMinutes,
  };
}

export function setRoomIdOfModifiedEvent(newRoomId) {
  return {
    type: SET_ROOM_ID_OF_MODIFIED_EVENT,
    newRoomId,
  };
}

function attemptModifConfirm() {
  return {
    type: ATTEMPT_MODIF_CONFIRM,
  };
}

function requestModif() {
  return {
    type: REQUEST_MODIF,
  };
}

function receiveModifConfirmation() {
  return {
    type: RECEIVE_MODIF_CONFIRMATION,
  };
}

function receiveModifUnknownError() {
  return {
    type: RECEIVE_MODIF_UNKNOWN_ERROR,
  };
}

function receiveModifAlreadyBookedError() {
  return {
    type: RECEIVE_MODIF_ALREADY_BOOKED_ERROR,
  };
}

export function sendModifRequest(event, newAttr) {
  function getUpdatedISOstring(isoDate, hour, minutes) {
    const newDate = new Date(isoDate);
    newDate.setUTCHours(hour, minutes);
    return newDate.toISOString();
  }

  return async dispatch => {
    dispatch(attemptModifConfirm());

    // Do nothing if eventName is empty
    if (!newAttr.eventName) return;

    dispatch(requestModif());

    // Format dates
    const newStartDate = getUpdatedISOstring(
      event.startDate,
      newAttr.startHour,
      newAttr.startMinutes,
    );
    const newEndDate = getUpdatedISOstring(
      event.startDate,
      newAttr.endHour,
      newAttr.endMinutes,
    );

    // Test if something has changed
    if (
      event.name === newAttr.eventName &&
      event.startDate === newStartDate &&
      event.endDate === newEndDate &&
      event.room.id === newAttr.roomId
    ) {
      dispatch(receiveModifConfirmation());
      return;
    }

    let unknownError;
    let data;
    try {
      data = await authenticatedFetch("book/modify", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event.id,
          newEventName: newAttr.eventName,
          newStartDate,
          newEndDate,
          newRoomId: newAttr.roomId,
        }),
      });
    } catch (e) {
      unknownError = true;
    }

    if (unknownError) {
      dispatch(receiveModifUnknownError());
    } else if (!data.success) {
      dispatch(receiveModifAlreadyBookedError());
    } else {
      dispatch(receiveModifConfirmation());
      dispatch(forceFetchBookings());
      dispatch(forceFetchRooms());
    }
  };
}
