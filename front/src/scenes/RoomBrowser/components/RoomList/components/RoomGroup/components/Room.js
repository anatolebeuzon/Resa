import React from "react";
import { connect } from "react-redux";

import { selectRoomToBook } from "../../../../RoomBookModal/actions";
import extractResources from "../../../../../../../services/extractResources";
import RoomResource from "../../../../../../../components/RoomResource";

const Room = ({ room, handleSelectRoomToBook }) => (
  <div
    className="card custom-hover-darkens mb-3"
    onClick={handleSelectRoomToBook}
    data-toggle="modal"
    data-target="#roomBookModal"
  >
    <div className="card-body">
      <div className="row align-items-center custom-no-margin-under-sm">
        <div className="col-sm-4 custom-no-padding-under-sm custom-text-center-under-sm">
          <h2 className="custom-text-color-cs">{room.name} </h2>
        </div>
        <div className="col-sm-8 custom-no-padding-under-sm">
          <ul>
            {extractResources(room).map(res => (
              <RoomResource key={`${room.id}#${res.type}`} resource={res} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

function mapDispatchToProps(dispatch, ownProps) {
  return {
    handleSelectRoomToBook: () => dispatch(selectRoomToBook(ownProps.room)),
  };
}

export default connect(() => ({}), mapDispatchToProps)(Room);
