import React from "react";
import FailureOrSuccessModal from "../../../../../components/Modals/FailureOrSuccessModal";

export default ({ failedBecauseAlreadyBooked }) => {
  let bodyText;
  if (failedBecauseAlreadyBooked) {
    bodyText = [
      "Cette salle est déjà réservée à l'horaire demandé.",
      <br />,
      <br />,
      "Essayez avec un autre horaire.",
    ];
  } else {
    bodyText = ["Une erreur s'est produite lors de la réservation."];
  }

  return (
    <FailureOrSuccessModal
      isAFailureModal={true}
      title="Modification de votre réservation"
      bodyText={bodyText}
    />
  );
};
