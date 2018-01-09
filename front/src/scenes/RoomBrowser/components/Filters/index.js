import React from "react";
import { connect } from "react-redux";

import {
  selectRoomType,
  setMinCapacity,
  toggleDisplayUnavailableRooms,
  setSearchText
} from "./actions";

import roomTypes from "./roomTypes.data";

import Checkbox from "../../../../components/Checkbox";
import SearchBar from "./components/SearchBar";
import TypeSelector from "./components/TypeSelector";
import CapacitySelector from "./components/CapacitySelector";

class Filters extends React.Component {
  render() {
    return (
      <div className="sticky-top custom-sticky">
        <SearchBar
          searchText={this.props.searchText}
          onSearchTextInput={this.props.setSearchText}
        />
        <div className="card my-3">
          <div className="card-body">
            <TypeSelector
              onChange={this.props.selectRoomType}
              data={roomTypes}
              selectedType={this.props.type}
            />
            <CapacitySelector
              onChange={this.props.setMinCapacity}
              minCapacity={this.props.minCapacity}
            />
            <Checkbox
              onChange={this.props.toggleDisplayUnavailableRooms}
              checked={this.props.displayUnavailableRooms}
              name="Afficher les salles indisponibles"
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...state.roomBrowser.filters };
}

function mapDispatchToProps(dispatch) {
  return {
    selectRoomType: e => {
      dispatch(selectRoomType(e.target.value));
    },
    setMinCapacity: pos => {
      dispatch(setMinCapacity(Math.floor(pos.x)));
    },
    toggleDisplayUnavailableRooms: () => {
      dispatch(toggleDisplayUnavailableRooms());
    },
    setSearchText: searchText => {
      dispatch(setSearchText(searchText));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
