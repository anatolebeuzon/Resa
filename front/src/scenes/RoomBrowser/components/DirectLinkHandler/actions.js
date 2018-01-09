import authenticatedFetch from "../../../../services/authenticatedFetch";
import getFormattedDate from "../../../../services/getFormattedDate";

import { selectRoomToBook } from "../RoomBookModal/actions";

export const NO_DIRECT_LINK = "NO_DIRECT_LINK";
export const SET_ROOM_ID = "SET_ROOM_ID";
export const REQUEST_ROOM_DETAIL = "REQUEST_ROOM_DETAIL";
export const RECEIVE_ROOM_DETAIL = "RECEIVE_ROOM_DETAIL";
export const RECEIVE_ROOM_DETAIL_FETCHING_ERROR =
  "RECEIVE_ROOM_DETAIL_FETCHING_ERROR";
export const TOGGLE_ACTION_SELECTOR = "TOGGLE_ACTION_SELECTOR";
export const REQUEST_ROOM_AGENDA = "REQUEST_ROOM_AGENDA";
export const RECEIVE_ROOM_AGENDA = "RECEIVE_ROOM_AGENDA";
export const RECEIVE_ROOM_AGENDA_FETCHING_ERROR =
  "RECEIVE_ROOM_AGENDA_FETCHING_ERROR";

export function confirmNoDirectLink() {
  return {
    type: NO_DIRECT_LINK
  };
}

export function setRoomId(roomId) {
  return {
    type: SET_ROOM_ID,
    roomId
  };
}

function requestRoomDetail() {
  return {
    type: REQUEST_ROOM_DETAIL
  };
}

function receiveRoomDetail(room) {
  return {
    type: RECEIVE_ROOM_DETAIL,
    room
  };
}

function receiveRoomDetailFetchingError() {
  return {
    type: RECEIVE_ROOM_DETAIL_FETCHING_ERROR
  };
}

export function fetchRoomDetail() {
  return async (dispatch, getState) => {
    const { roomId } = getState().roomBrowser.directLinkHandler.actionSelector;
    dispatch(requestRoomDetail());

    let error;
    let data;
    const currentDate = new Date();
    try {
      data = await authenticatedFetch(
        `search/roomDetail/${roomId}/${currentDate.toISOString()}`
      );
    } catch (e) {
      error = true;
    }

    if (error) {
      dispatch(receiveRoomDetailFetchingError());
    } else {
      dispatch(receiveRoomDetail(data));
    }
  };
}

export function toggleActionSelector() {
  return {
    type: TOGGLE_ACTION_SELECTOR
  };
}

function requestRoomAgenda() {
  return {
    type: REQUEST_ROOM_AGENDA
  };
}

function receiveRoomAgenda() {
  return {
    type: RECEIVE_ROOM_AGENDA
  };
}

function receiveRoomAgendaFetchingError() {
  return {
    type: RECEIVE_ROOM_AGENDA_FETCHING_ERROR
  };
}

export function fetchRoomAgenda() {
  return async (dispatch, getState) => {
    const state = getState();
    const { roomId } = state.roomBrowser.directLinkHandler.actionSelector;
    const {
      selectedDate,
      selectedStartTime,
      selectedEndTime
    } = state.roomBrowser.dateTime;

    dispatch(requestRoomAgenda());
    dispatch(selectRoomToBook(null));

    const formattedDate = getFormattedDate(
      selectedDate,
      selectedStartTime,
      selectedEndTime
    );

    let error;
    let data;
    try {
      data = await authenticatedFetch(
        `search/roomAgenda/${roomId}/${formattedDate.start}/${
          formattedDate.end
        }`
      );
    } catch (e) {
      error = true;
    }

    if (error) {
      dispatch(receiveRoomAgendaFetchingError());
    } else {
      dispatch(receiveRoomAgenda());
      dispatch(selectRoomToBook(data));
    }
  };
}
