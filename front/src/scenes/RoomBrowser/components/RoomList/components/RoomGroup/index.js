import React from "react";
import { Collapse } from "react-collapse";
import InfiniteScroll from "react-infinite-scroller";
import ReactTooltip from "react-tooltip";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/fontawesome-free-solid";

import Room from "./components/Room";

export default class RoomGroup extends React.PureComponent {
  state = { isOpened: false, roomsToDisplay: 10 };

  handleLoadMoreRooms = () => {
    this.setState(prevState => ({
      roomsToDisplay: prevState.roomsToDisplay + 10
    }));
  };

  toggleRooms = () => {
    this.setState(prevState => ({ isOpened: !prevState.isOpened }));
  };

  render() {
    const roomsToDisplayInitially = 3;

    const { groupname, rooms, loadingAnimation } = this.props;

    return (
      <div>
        <div className="row justify-content-between align-items-center no-gutters">
          <div className="col-md-auto">
            <h4 className="pt-0">{`Bâtiment ${groupname} (${
              this.props.rooms.length
            } salles)`}</h4>
          </div>
          <div className="col-md-auto">
            {this.state.isOpened && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.toggleRooms}
              >
                Réduire
              </button>
            )}
          </div>
        </div>
        <ul>
          {rooms.slice(0, roomsToDisplayInitially).map(room => (
            <li key={room.id}>
              <Room room={room} />
            </li>
          ))}
          {!this.state.isOpened &&
            rooms.length > roomsToDisplayInitially && (
              <div className="text-center">
                <button
                  className="btn btn-link custom-cursor-pointer"
                  type="button"
                  onClick={this.toggleRooms}
                  data-tip="Afficher plus de salles dans ce bâtiment"
                  data-for={`${groupname.split(" ").join("-")}-show-more`}
                >
                  <FontAwesomeIcon icon={faEllipsisH} />
                </button>
                <ReactTooltip
                  id={`${groupname.split(" ").join("-")}-show-more`}
                  effect="solid"
                />
              </div>
            )}
          <Collapse isOpened={this.state.isOpened}>
            <InfiniteScroll
              pageStart={0}
              loadMore={this.handleLoadMoreRooms}
              hasMore={this.state.roomsToDisplay < rooms.length}
              loader={loadingAnimation}
            >
              {rooms
                .slice(roomsToDisplayInitially, this.state.roomsToDisplay)
                .map(room => (
                  <li key={room.id}>
                    <Room room={room} />
                  </li>
                ))}
            </InfiniteScroll>
          </Collapse>
        </ul>
      </div>
    );
  }
}
