import { combineReducers } from "redux";
import list from "./components/BookingsList/reducers";
import cancel from "./components/CancelEventModal/reducers";
import modify from "./components/ModifyEventModal/reducers";

const myBookings = combineReducers({
  list,
  cancel,
  modify,
});

export default myBookings;
