import React from "react";
import { connect } from "react-redux";
import { faCalendarAlt, faClock } from "@fortawesome/fontawesome-free-regular";

import {
  selectDate,
  selectStartTime,
  selectEndTime,
  toggleDatePicker,
  toggleTimePicker
} from "./actions";
import { fetchRoomAgenda } from "../DirectLinkHandler/actions";
import DatePickerWrapper from "./components/DatePickerWrapper";
import DateTimeChangeButton from "./components/DateTimeChangeButton";
import TimePicker from "./components/TimePicker";

const moment = require("moment");
require("moment/locale/fr");

class DateTimePicker extends React.Component {
  render() {
    return (
      <div>
        <DatePickerWrapper
          handleDateSelect={this.props.selectDate}
          selectedDate={this.props.selectedDate}
          isOpened={this.props.displayDatePicker}
        />
        {this.props.displayDateTimeStatusBar && (
          <div className="row align-items-center mb-3">
            <div className="col-md-3">
              {!this.props.displayDatePicker && (
                <DateTimeChangeButton
                  handleClick={this.props.toggleDatePicker}
                  icon={faCalendarAlt}
                  tooltip="Modifier la date"
                />
              )}
              {!this.props.displayTimePicker &&
                !this.props.timeNeedsUserInitialization && (
                  <DateTimeChangeButton
                    handleClick={this.props.toggleTimePicker}
                    icon={faClock}
                    tooltip="Modifier les horaires"
                  />
                )}
            </div>
            <div className="col-md-6 text-center">
              <span className="align-middle">
                {!this.props.displayDatePicker && (
                  <span>
                    {moment(this.props.selectedDate).format("dddd D MMMM")}
                  </span>
                )}
                {!this.props.displayTimePicker &&
                  !this.props.timeNeedsUserInitialization && (
                    <span>
                      {" "}
                      de {this.props.selectedStartTime.format("H[h]mm")} à{" "}
                      {this.props.selectedEndTime.format("H[h]mm")}
                    </span>
                  )}
              </span>
            </div>

            <div className="col-md-3" />
          </div>
        )}
        <TimePicker
          handleStartTimeChange={this.props.selectStartTime}
          handleEndTimeChange={this.props.selectEndTime}
          startTime={this.props.selectedStartTime}
          endTime={this.props.selectedEndTime}
          isOpened={this.props.displayTimePicker}
          toggle={this.props.toggleTimePicker}
          directLinkRoomName={
            this.props.directLinkRoom && this.props.directLinkRoom.name
          }
          openDirectBookingWindow={this.props.fetchRoomAgenda}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.roomBrowser.dateTime,
    directLinkRoom: state.roomBrowser.directLinkHandler.actionSelector.room
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectDate: date => dispatch(selectDate(date)),
    selectStartTime: time => dispatch(selectStartTime(time)),
    selectEndTime: time => dispatch(selectEndTime(time)),
    toggleDatePicker: () => dispatch(toggleDatePicker()),
    toggleTimePicker: () => dispatch(toggleTimePicker()),
    fetchRoomAgenda: () => dispatch(fetchRoomAgenda())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DateTimePicker);
