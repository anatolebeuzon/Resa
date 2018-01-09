import React from "react";
import { object } from "prop-types";
import { connect } from "react-redux";

import ConfirmModify from "./components/ConfirmModify";
import FailedModify from "./components/FailedModify";
import SuccessfulModify from "./components/SuccessfulModify";
import Loading from "../../../../components/Modals/LoadingModal";

import {
  sendModifRequest,
  setNameOfModifiedEvent,
  setStartHourOfModifiedEvent,
  setStartMinutesOfModifiedEvent,
  setEndHourOfModifiedEvent,
  setEndMinutesOfModifiedEvent,
} from "./actions";

class ModifyEventModal extends React.PureComponent {
  static propTypes = {
    event: object,
  };

  sendUpdatedBooking = () => {
    const { dispatch, event, newAttributes } = this.props;
    dispatch(sendModifRequest(event, newAttributes));
  };

  detectEnter = event => {
    if (event.key === "Enter") {
      this.sendUpdatedBooking();
    }
  };

  render() {
    const {
      status,
      event,
      newAttributes,
      handleNameInputChange,
      handleDateInputChange,
    } = this.props;

    return (
      <div
        className="modal fade"
        id="modifyEventModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modifyEventModal"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          {event && !status.frontendValidationPassed ? (
            <ConfirmModify
              event={event}
              modifType={status.modifType}
              sendUpdatedBooking={this.sendUpdatedBooking}
              handleNameInputChange={handleNameInputChange}
              handleDateInputChange={handleDateInputChange}
              newAttributes={newAttributes}
              detectEnter={this.detectEnter}
              attemptedConfirm={status.attemptedConfirm}
            />
          ) : null}
          {status.isFetching && <Loading />}
          {status.frontendValidationPassed &&
            !status.isFetching &&
            status.success && <SuccessfulModify />}
          {status.frontendValidationPassed &&
            !status.isFetching &&
            !status.success && (
              <FailedModify
                failedBecauseAlreadyBooked={status.failedBecauseAlreadyBooked}
              />
            )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state.myBookings.modify };
}

function mapDispatchToProps(dispatch) {
  return {
    handleDateInputChange: {
      startHour: event =>
        dispatch(setStartHourOfModifiedEvent(event.target.value)),
      startMinutes: event =>
        dispatch(setStartMinutesOfModifiedEvent(event.target.value)),
      endHour: event => dispatch(setEndHourOfModifiedEvent(event.target.value)),
      endMinutes: event =>
        dispatch(setEndMinutesOfModifiedEvent(event.target.value)),
    },
    handleNameInputChange: event =>
      dispatch(setNameOfModifiedEvent(event.target.value)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyEventModal);
