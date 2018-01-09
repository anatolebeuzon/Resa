import React from "react";
import FailureOrSuccessModal from "../../../../../components/Modals/FailureOrSuccessModal";

export default () => (
  <FailureOrSuccessModal
    isAFailureModal={false}
    title="Modification de votre réservation"
    bodyText="Votre réservation a bien été modifiée."
  />
);
