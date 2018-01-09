import React, { Component } from "react";
import { connect } from "react-redux";
import { sendCancelRequest } from "./actions";

import ConfirmCancel from "./components/ConfirmCancel";
import FailedCancel from "./components/FailedCancel";
import SuccessfulCancel from "./components/SuccessfulCancel";
import Loading from "../../../../components/Modals/LoadingModal";

class CancelEventModal extends Component {
  render() {
    const {
      event,
      success,
      isFetching,
      userConfirmedCancellation,
      cancelBooking,
    } = this.props;
    return (
      <div
        className="modal fade"
        id="cancelEventModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="cancelEventModal"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          {event && !userConfirmedCancellation ? (
            <ConfirmCancel event={event} cancelBooking={cancelBooking} />
          ) : null}
          {isFetching && <Loading />}
          {userConfirmedCancellation &&
            !isFetching &&
            success && <SuccessfulCancel />}
          {userConfirmedCancellation &&
            !isFetching &&
            !success && <FailedCancel />}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    cancelBooking: () => dispatch(sendCancelRequest(ownProps.event.id)),
    dispatch,
  };
}

export default connect(state => state.myBookings.cancel, mapDispatchToProps)(
  CancelEventModal,
);
