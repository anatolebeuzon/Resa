import React from "react";
import { connect } from "react-redux";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/fontawesome-free-solid";

import { fetchRoomsIfNeeded, forceFetchRooms } from "./actions";
import applyFilters from "../../../../services/applyFilters";
import RoomGroup from "./components/RoomGroup";
import LoadSpinner from "../../../../components/LoadSpinner";

class RoomList extends React.Component {
  componentDidMount() {
    this.props.fetchRoomsIfNeeded();
  }

  render() {
    const loadingAnimation = (
      <div className="text-center pt-3 pb-3">
        <LoadSpinner />
      </div>
    );

    if (this.props.isFetching) return loadingAnimation;

    if (this.props.errorWhileFetching) {
      return (
        <div className="card">
          <div className="card-body">
            <strong>
              Hum, une erreur s'est produite lors de la recherche de salles...
            </strong>
            <p>
              <button
                className="btn btn-link custom-cursor-pointer"
                onClick={this.props.forceFetchRooms}
              >
                <FontAwesomeIcon icon={faSync} /> Cliquez ici pour réessayer
              </button>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        {this.props.roomGroups.map(group => (
          <RoomGroup
            groupname={group.name}
            rooms={applyFilters(group.content, this.props.filters)}
            loadingAnimation={loadingAnimation}
            key={group.name}
          />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.roomBrowser.list,
    selectedDate: state.roomBrowser.dateTime.selectedDate,
    selectedTime: state.roomBrowser.dateTime.selectedTime,
    filters: state.roomBrowser.filters
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRoomsIfNeeded: () => dispatch(fetchRoomsIfNeeded()),
    forceFetchRooms: () => dispatch(forceFetchRooms())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomList);
