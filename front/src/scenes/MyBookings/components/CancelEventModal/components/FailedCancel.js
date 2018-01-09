import React from "react";
import FailureOrSuccessModal from "../../../../../components/Modals/FailureOrSuccessModal";

export default () => {
  const bodyText = [
    "Une erreur s'est produite lors de l'annulation de la réservation.",
  ];

  return (
    <FailureOrSuccessModal
      isAFailureModal={true}
      title="Annulation de votre réservation"
      bodyText={bodyText}
    />
  );
};
