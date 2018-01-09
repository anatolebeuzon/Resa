import { combineReducers } from "redux";
import directLinkHandler from "./components/DirectLinkHandler/reducers";
import dateTime from "./components/DateTimePicker/reducers";
import filters from "./components/Filters/reducers";
import book from "./components/RoomBookModal/reducers";
import list from "./components/RoomList/reducers";

const roomBrowser = combineReducers({
  directLinkHandler,
  dateTime,
  filters,
  book,
  list
});

export default roomBrowser;
