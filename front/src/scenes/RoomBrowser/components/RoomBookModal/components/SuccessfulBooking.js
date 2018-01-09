import React from "react";
import { withRouter } from "react-router-dom";
import FailureOrSuccessModal from "../../../../../components/Modals/FailureOrSuccessModal";

export default withRouter(({ room, history }) => (
  <FailureOrSuccessModal
    isAFailureModal={false}
    title={`Réservation de la salle ${room.name}`}
    bodyText="La salle est désormais réservée."
    redirectFunction={() => history.push("/reservations")}
  />
));
