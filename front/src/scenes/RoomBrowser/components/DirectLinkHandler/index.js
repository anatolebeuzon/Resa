import React from "react";
import { connect } from "react-redux";
import { Collapse } from "react-collapse";

import {
  confirmNoDirectLink,
  setRoomId,
  fetchRoomDetail,
  toggleActionSelector
} from "./actions";
import {
  showDatePicker,
  hideDatePicker,
  hideTimePicker,
  hideDatetimeStatusBar
} from "../DateTimePicker/actions";

import DirectLinkActionSelector from "./components/DirectLinkActionSelector";
import DirectLinkStatusBar from "./components/DirectLinkStatusBar";

class DirectLinkHandler extends React.Component {
  componentDidMount() {
    if (this.props.resourceId) {
      this.props.setRoomId(this.props.resourceId);
      this.props.fetchRoomDetail();
      this.props.hideDatePicker();
    } else {
      // Direct link is not being used, so show date picker directly
      this.props.confirmNoDirectLink();
    }
  }

  render() {
    if (this.props.resourceId) {
      return (
        <div>
          <Collapse isOpened={this.props.displayActionSelector}>
            <DirectLinkActionSelector
              isFetching={this.props.isFetching}
              errorWhileFetching={this.props.errorWhileFetching}
              retryFetch={this.props.fetchRoomDetail.bind(this)}
              room={this.props.room}
              onClickBookButton={this.props.initBookingProcess}
            />
          </Collapse>
          {!this.props.displayActionSelector && (
            <DirectLinkStatusBar
              roomName={this.props.room.name}
              showActionSelector={this.props.showActionSelector}
            />
          )}
        </div>
      );
    }
    return null;
  }
}

function mapStateToProps(state) {
  return {
    ...state.roomBrowser.directLinkHandler.actionSelector
  };
}

function mapDispatchToProps(dispatch) {
  return {
    confirmNoDirectLink: () => dispatch(confirmNoDirectLink()),
    setRoomId: roomId => dispatch(setRoomId(roomId)),
    fetchRoomDetail: () => dispatch(fetchRoomDetail()),
    initBookingProcess: () => {
      dispatch(toggleActionSelector());
      dispatch(showDatePicker());
    },
    showActionSelector: () => {
      dispatch(toggleActionSelector());
      dispatch(hideDatePicker());
      dispatch(hideTimePicker());
      dispatch(hideDatetimeStatusBar());
    },
    hideDatePicker: () => dispatch(hideDatePicker())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectLinkHandler);
