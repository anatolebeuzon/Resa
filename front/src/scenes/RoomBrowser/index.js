import React from "react";
import { connect } from "react-redux";

import DateTimePicker from "./components/DateTimePicker";
import RoomBookModal from "./components/RoomBookModal";
import RoomList from "./components/RoomList";
import Filters from "./components/Filters";
import DirectLinkHandler from "./components/DirectLinkHandler";

const RoomBrowser = ({ displayRoomList, match }) => (
  <div>
    <div className="container">
      <DirectLinkHandler resourceId={match.params.resourceId} />
      <DateTimePicker />
      {displayRoomList && (
        <div className="row">
          <div className="col-lg-4 mb-3">
            <Filters />
          </div>
          <div className="col-lg-8">
            <RoomList />
          </div>
        </div>
      )}
    </div>
    <RoomBookModal />
  </div>
);

function mapStateToProps(state) {
  const { displayDatePicker, displayTimePicker } = state.roomBrowser.dateTime;
  const { noDirectLink } = state.roomBrowser.directLinkHandler.actionSelector;

  return {
    displayRoomList: noDirectLink && !displayDatePicker && !displayTimePicker
  };
}

export default connect(mapStateToProps)(RoomBrowser);
