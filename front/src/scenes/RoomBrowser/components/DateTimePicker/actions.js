export const SELECT_DATE = "SELECT_DATE";
export const SELECT_START_TIME = "SELECT_START_TIME";
export const SELECT_END_TIME = "SELECT_END_TIME";
export const TOGGLE_DATE_PICKER = "TOGGLE_DATE_PICKER";
export const HIDE_DATE_PICKER = "HIDE_DATE_PICKER";
export const SHOW_DATE_PICKER = "SHOW_DATE_PICKER";
export const TOGGLE_TIME_PICKER = "TOGGLE_TIME_PICKER";
export const HIDE_TIME_PICKER = "HIDE_TIME_PICKER";
export const SHOW_TIME_PICKER = "SHOW_TIME_PICKER";
export const HIDE_DATETIME_STATUS_BAR = "HIDE_DATETIME_STATUS_BAR";

export function selectDate(dateObj) {
  return {
    type: SELECT_DATE,
    content: dateObj
  };
}

export function selectStartTime(startTime) {
  return {
    type: SELECT_START_TIME,
    content: startTime
  };
}

export function selectEndTime(endTime) {
  return {
    type: SELECT_END_TIME,
    content: endTime
  };
}

export function toggleDatePicker() {
  return {
    type: TOGGLE_DATE_PICKER
  };
}

export function hideDatePicker() {
  return {
    type: HIDE_DATE_PICKER
  };
}

export function showDatePicker() {
  return {
    type: SHOW_DATE_PICKER
  };
}

export function toggleTimePicker() {
  return {
    type: TOGGLE_TIME_PICKER
  };
}

export function hideTimePicker() {
  return {
    type: HIDE_TIME_PICKER
  };
}

export function showTimePicker() {
  return {
    type: SHOW_TIME_PICKER
  };
}

export function hideDatetimeStatusBar() {
  return {
    type: HIDE_DATETIME_STATUS_BAR
  };
}
