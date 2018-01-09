import React from "react";
import FailureOrSuccessModal from "../../../../../components/Modals/FailureOrSuccessModal";

export default ({
  room,
  failedBecauseAlreadyBooked,
  failedBecauseMissingEmail,
}) => {
  let bodyText;
  if (failedBecauseAlreadyBooked) {
    bodyText = [
      "Cette salle est déjà réservée à l'horaire demandé.",
      <br />,
      <br />,
      "Essayez avec une autre salle ou un autre horaire.",
    ];
  } else if (failedBecauseMissingEmail) {
    bodyText = [
      "Vous ne faites pas encore partie des utilisateurs pouvant utiliser Resa.",
    ];
  } else {
    bodyText = ["Une erreur s'est produite lors de la réservation."];
  }

  return (
    <FailureOrSuccessModal
      title={`Réservation de la salle ${room.name}`}
      isAFailureModal={true}
      bodyText={bodyText}
    />
  );
};
