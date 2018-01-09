import React from "react";
import { connect } from "react-redux";

import { sendBookRequest, setEventName } from "./actions";
import ConfirmBooking from "./components/ConfirmBooking";
import FailedBooking from "./components/FailedBooking";
import SuccessfulBooking from "./components/SuccessfulBooking";
import Loading from "../../../../components/Modals/LoadingModal";
import AgendaFetchingError from "./components/AgendaFetchingError";

const RoomBookModal = ({
  isFetching,
  isFetchingAgenda,
  errorWhileFetchingAgenda,
  success,
  room,
  requestSent,
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  eventName,
  attemptedConfirm,
  failedBecauseAlreadyBooked,
  failedBecauseMissingEmail,
  handleSendBookRequest,
  handleSetEventName,
  detectEnter,
  directLinkRoom
}) => (
  <div
    className="modal fade"
    id="roomBookModal"
    tabIndex="-1"
    role="dialog"
    aria-labelledby="roomBookModal"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-lg" role="document">
      {room && !requestSent && !isFetching ? (
        <ConfirmBooking
          room={room}
          selectedDate={selectedDate}
          startTime={selectedStartTime}
          endTime={selectedEndTime}
          confirmBooking={handleSendBookRequest}
          handleEventNameInputChange={handleSetEventName}
          eventName={eventName}
          attemptedConfirm={attemptedConfirm}
          detectEnter={detectEnter}
        />
      ) : null}
      {((requestSent && isFetching) || isFetchingAgenda) && <Loading />}
      {errorWhileFetchingAgenda && (
        <AgendaFetchingError roomName={directLinkRoom && directLinkRoom.name} />
      )}
      {requestSent &&
        !isFetching &&
        success && <SuccessfulBooking room={room} />}
      {requestSent &&
        !isFetching &&
        !success && (
          <FailedBooking
            room={room}
            failedBecauseAlreadyBooked={failedBecauseAlreadyBooked}
            failedBecauseMissingEmail={failedBecauseMissingEmail}
          />
        )}
    </div>
  </div>
);

function mapStateToProps(state) {
  return {
    ...state.roomBrowser.book,
    selectedDate: state.roomBrowser.dateTime.selectedDate,
    selectedStartTime: state.roomBrowser.dateTime.selectedStartTime,
    selectedEndTime: state.roomBrowser.dateTime.selectedEndTime,
    isFetchingAgenda: state.roomBrowser.directLinkHandler.roomAgenda.isFetching,
    errorWhileFetchingAgenda:
      state.roomBrowser.directLinkHandler.roomAgenda.errorWhileFetching,
    directLinkRoom: state.roomBrowser.directLinkHandler.actionSelector.room
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleSendBookRequest: () => dispatch(sendBookRequest()),
    handleSetEventName: event => dispatch(setEventName(event.target.value)),
    detectEnter: event => {
      if (event.key === "Enter") dispatch(sendBookRequest());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomBookModal);
