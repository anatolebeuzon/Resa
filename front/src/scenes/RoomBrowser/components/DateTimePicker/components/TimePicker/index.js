import React from "react";
import { Collapse } from "react-collapse";
import { instanceOf, func, bool } from "prop-types";
import moment from "moment";

import TimeInput from "./components/TimeInput";

export default class TimePicker extends React.PureComponent {
  state = { incoherentTimes: false };

  static propTypes = {
    handleStartTimeChange: func.isRequired,
    handleEndTimeChange: func.isRequired,
    startTime: instanceOf(moment).isRequired,
    endTime: instanceOf(moment).isRequired,
    isOpened: bool.isRequired,
    toggle: func.isRequired
  };

  handleStartTimeChange = startTime => {
    this.props.handleStartTimeChange(startTime);
    this.checkTimeCoherence();
    this.forceUpdate();
  };

  handleEndTimeChange = endTime => {
    this.props.handleEndTimeChange(endTime);
    this.checkTimeCoherence();
    this.forceUpdate();
  };

  checkTimeCoherence = () => {
    if (this.props.endTime.isSameOrBefore(this.props.startTime)) {
      this.setState({ incoherentTimes: true });
    } else {
      this.setState({ incoherentTimes: false });
    }
  };

  format = timeToFormat => {
    let hours = timeToFormat.substring(0, 2);
    let minutes = "";

    if (timeToFormat.slice(-2) !== "00") {
      minutes = timeToFormat.slice(-2);
    }

    if (timeToFormat.substring(0, 1) === "0") {
      hours = hours.substring(1, 2);
    }

    return `${hours}h${minutes}`;
  };

  render() {
    const {
      isOpened,
      startTime,
      endTime,
      toggle,
      directLinkRoomName,
      openDirectBookingWindow
    } = this.props;

    return (
      <Collapse isOpened={isOpened}>
        <div className="row">
          <div className="col-12">
            <div className="card my-3">
              <div className="card-body">
                <div className="row justify-content-around no-gutters">
                  <div className="col-lg-4">
                    <h4 className="pt-0 mb-4 text-center">Heure de début</h4>
                    <TimeInput
                      moment={startTime}
                      onChange={this.handleStartTimeChange}
                    />
                  </div>
                  <div className="col-lg-4">
                    <h4 className="pt-0 mb-4 text-center">Heure de fin</h4>
                    <TimeInput
                      moment={endTime}
                      onChange={this.handleEndTimeChange}
                    />
                  </div>
                </div>
                <div className="row justify-content-center">
                  {!directLinkRoomName && (
                    <button
                      type="button"
                      className="btn btn-success custom-btn-cs"
                      onClick={toggle}
                      disabled={this.state.incoherentTimes}
                    >
                      Voir les salles disponibles
                    </button>
                  )}
                  {directLinkRoomName && (
                    <button
                      type="button"
                      className="btn btn-success custom-btn-cs"
                      onClick={openDirectBookingWindow}
                      data-toggle="modal"
                      data-target="#roomBookModal"
                      disabled={this.state.incoherentTimes}
                    >
                      Voir la disponibilité
                    </button>
                  )}
                </div>
                {this.state.incoherentTimes && (
                  <div className="row justify-content-center mt-3">
                    <p>
                      L'heure de début doit être antérieure à l'heure de fin.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Collapse>
    );
  }
}
