import React from "react";

import { connect } from "react-redux";
import BookingsList from "./components/BookingsList";
import CancelEventModal from "./components/CancelEventModal";
import ModifyEventModal from "./components/ModifyEventModal";
import { openCancelModal } from "./components/CancelEventModal/actions";
import {
  forceFetchBookings,
  fetchBookingsIfNeeded,
} from "./components/BookingsList/actions";
import { initializeModifModal } from "./components/ModifyEventModal/actions";

class MyBookings extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch(fetchBookingsIfNeeded());
  }

  componentDidUpdate() {
    this.props.dispatch(fetchBookingsIfNeeded());
  }

  reloadBookings = () => {
    this.props.dispatch(forceFetchBookings());
  };

  getBookingWithId(eventId, bookingGroups) {
    if (eventId) {
      const futureGroup = bookingGroups.filter(
        group => group.name === "future",
      )[0];
      if (futureGroup) {
        return futureGroup.content.filter(event => event.id === eventId)[0];
      }
    }
    return null;
  }

  render() {
    const {
      isFetching,
      errorWhileFetching,
      bookingGroups,
    } = this.props.myBookings;
    const {
      selectedCancelEventId,
      selectedModifyEventId,
      handleCancelEvent,
      handleModifyEvent,
    } = this.props;
    return (
      <div className="container">
        <BookingsList
          loading={isFetching}
          error={errorWhileFetching}
          eventGroups={bookingGroups}
          handleCancelEvent={handleCancelEvent}
          handleModifyEvent={handleModifyEvent}
          reload={this.reloadBookings}
        />
        <CancelEventModal
          event={this.getBookingWithId(selectedCancelEventId, bookingGroups)}
        />
        <ModifyEventModal
          event={this.getBookingWithId(selectedModifyEventId, bookingGroups)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    myBookings: state.myBookings.list,
    selectedCancelEventId: state.myBookings.cancel.eventId,
    selectedModifyEventId: state.myBookings.modify.status.eventId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    handleCancelEvent: eventId => dispatch(openCancelModal(eventId)),
    handleModifyEvent: (eventId, modifType) =>
      dispatch(initializeModifModal(eventId, modifType)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBookings);
