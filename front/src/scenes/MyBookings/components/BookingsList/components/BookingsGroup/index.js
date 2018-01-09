import React from "react";
import { Collapse } from "react-collapse";
import InfiniteScroll from "react-infinite-scroller";
import { string, array, func } from "prop-types";
import { connect } from "react-redux";

import Booking from "./components/Booking";
import { togglePastBookings, showMorePastBookings } from "../../actions";
import LoadSpinner from "../../../../../../components/LoadSpinner";

class BookingsGroups extends React.PureComponent {
  static propTypes = {
    groupname: string.isRequired,
    events: array.isRequired,
    handleCancelEvent: func.isRequired,
    handleModifyEvent: func.isRequired
  };

  render() {
    const {
      groupname,
      events,
      handleCancelEvent,
      handleModifyEvent
    } = this.props;

    let groupTitle;
    if (groupname === "past") {
      groupTitle = "Vos réservations passées";
    } else {
      groupTitle = "Vos réservations à venir";
    }

    const isFuture = groupname === "future";

    const loadingAnimation = (
      <div className="text-center pt-3 pb-3">
        <LoadSpinner />
      </div>
    );

    if (isFuture) {
      return (
        <div className="mb-5">
          <h4 className="px-2 pt-0 pb-2">{groupTitle}</h4>
          {events.map(event => (
            <Booking
              event={event}
              handleCancelEvent={handleCancelEvent}
              handleModifyEvent={handleModifyEvent}
              isFuture={isFuture}
              key={event.id}
            />
          ))}
        </div>
      );
    }
    return (
      <div className="mb-5">
        <div className="row justify-content-start align-items-center no-gutters py-2">
          <h4 className="px-2 py-0 m-0">{groupTitle}</h4>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={this.props.togglePastBookings}
          >
            {this.props.displayPastBookings ? "Réduire" : "Afficher"}
          </button>
        </div>
        <Collapse isOpened={this.props.displayPastBookings}>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.props.showMorePastBookings}
            hasMore={this.props.pastBookingsToDisplay < events.length}
            loader={loadingAnimation}
          >
            {events
              .slice(0, this.props.pastBookingsToDisplay)
              .map(event => (
                <Booking event={event} isFuture={isFuture} key={event.id} />
              ))}
            <p className="text-center text-secondary font-weight-light">
              Les réservations datant d'il y a plus de trois mois ne sont pas
              affichées.
            </p>
          </InfiniteScroll>
        </Collapse>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    displayPastBookings: state.myBookings.list.displayPastBookings,
    pastBookingsToDisplay: state.myBookings.list.pastBookingsToDisplay
  };
}

function mapDispatchToProps(dispatch) {
  return {
    togglePastBookings: () => dispatch(togglePastBookings()),
    showMorePastBookings: () => dispatch(showMorePastBookings())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingsGroups);
