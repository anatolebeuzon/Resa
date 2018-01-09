import React from "react";
import FailureOrSuccessModal from "../../../../../components/Modals/FailureOrSuccessModal";

export default ({ roomName }) => {
  const bodyText = [
    `Erreur lors du chargement du planning de la salle ${roomName}.`,
    <br />,
    <br />,
    "Il se peut que cette salle ne soit pas ouverte à la réservation sur Resa."
  ];
  return (
    <FailureOrSuccessModal
      title={`Réservation de la salle ${roomName}`}
      isAFailureModal={true}
      bodyText={bodyText}
    />
  );
};
