import React from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/fontawesome-free-solid";

import BookingsGroup from "./components/BookingsGroup";
import LoadSpinner from "../../../../components/LoadSpinner";

export default ({
  loading,
  error,
  eventGroups,
  handleCancelEvent,
  handleModifyEvent,
  reload
}) => {
  const loadingAnimation = (
    <div className="text-center pt-3 pb-3">
      <LoadSpinner />
    </div>
  );

  if (loading) return loadingAnimation;

  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <strong>
            Hum, une erreur s'est produite lors de la recherche de vos
            réservations...
          </strong>
          <p>
            <button
              className="btn btn-link custom-cursor-pointer"
              onClick={reload}
            >
              <FontAwesomeIcon icon={faSync} /> Cliquez ici pour réessayer
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (eventGroups.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <strong>Vous n'avez reservé aucune salle pour l'instant.</strong>
        </div>
      </div>
    );
  }

  return (
    <div>
      {eventGroups.map(group => (
        <BookingsGroup
          groupname={group.name}
          events={group.content}
          handleCancelEvent={handleCancelEvent}
          handleModifyEvent={handleModifyEvent}
          key={group.name}
        />
      ))}
    </div>
  );
};
