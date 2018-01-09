import React from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/fontawesome-free-solid";
import RoomResource from "../../../../../../../components/RoomResource";
import extractResources from "../../../../../../../services/extractResources";

const moment = require("moment");
require("moment/locale/fr");

export default ({ event, handleCancelEvent, handleModifyEvent, isFuture }) => (
  <div className="card mb-3">
    <div className="card-body">
      <div className="row align-items-center justify-content-between">
        <div className="col-lg-2 custom-text-center-under-lg">
          <h2 className="custom-text-color-cs">
            {event.room && event.room.name}{" "}
          </h2>
        </div>
        <div className="col-lg-4">
          <ul>
            {event.room &&
              extractResources(event.room).map(res => (
                <RoomResource
                  key={`${event.room.id}#${res.type}`}
                  resource={res}
                  showBuilding={true}
                />
              ))}
          </ul>
        </div>
        <div className="col-lg-3 my-4 custom-info-text-color">
          <h5>{event.name}</h5>
          {moment(event.startDate)
            .utc()
            .format("dddd D MMMM")}
          <br />
          {moment(event.startDate)
            .utc()
            .format("H[h]mm")}{" "}
          <FontAwesomeIcon icon={faAngleRight} />{" "}
          {moment(event.endDate)
            .utc()
            .format("H[h]mm")}
        </div>
        <div className="col-lg-3 custom-text-right-above-lg custom-text-center-under-lg">
          {isFuture && (
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Modifier
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <button
                  className="dropdown-item"
                  data-toggle="modal"
                  data-target="#modifyEventModal"
                  onClick={() => {
                    handleModifyEvent(event, "name");
                  }}
                >
                  Modifier le titre
                </button>
                <button
                  className="dropdown-item"
                  data-toggle="modal"
                  data-target="#modifyEventModal"
                  onClick={() => {
                    handleModifyEvent(event, "time");
                  }}
                >
                  Modifier l'horaire
                </button>

                <div className="dropdown-divider" />
                <button
                  className="dropdown-item"
                  data-toggle="modal"
                  data-target="#cancelEventModal"
                  onClick={() => handleCancelEvent(event.id)}
                >
                  Annuler la réservation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
