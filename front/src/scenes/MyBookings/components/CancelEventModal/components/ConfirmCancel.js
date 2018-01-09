import React from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/fontawesome-free-solid";
import ConfirmModal from "../../../../../components/Modals/ConfirmModal";

const moment = require("moment");
require("moment/locale/fr");

export default ({ event, cancelBooking }) => {
  const body = (
    <div className="row align-items-center justify-content-center">
      <div className="col-auto">Réservation à annuler :</div>
      <div className="col-auto">
        <h6 className="mb-1">{event.name}</h6>
        <div className="text-primary">
          Salle {event.room.name}
          <br />
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
      </div>
    </div>
  );

  return (
    <ConfirmModal
      title="Annulation de votre réservation"
      body={body}
      confirmButtonText={
        <span>
          Annuler<span className="d-none d-sm-inline"> la réservation</span>
        </span>
      }
      confirmButtonFunction={cancelBooking}
      cancelActionText="Ne pas annuler"
      clearFunction={null}
    />
  );
};
