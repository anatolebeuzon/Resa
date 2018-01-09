import React from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/fontawesome-free-solid";

import EventList from "../../../../../components/EventList";
import LoadSpinner from "../../../../../components/LoadSpinner";

export default ({
  isFetching,
  errorWhileFetching,
  retryFetch,
  room,
  onClickBookButton
}) => {
  const loadingAnimation = (
    <div className="text-center pt-3 pb-3">
      <LoadSpinner />
    </div>
  );

  if (isFetching) return loadingAnimation;

  if (errorWhileFetching) {
    return (
      <div className="row justify-content-center">
        <div className="jumbotron col-lg-6">
          <strong>
            Hum, une erreur s'est produite lors de la recherche de la salle...
          </strong>
          <p>
            <button
              className="btn btn-link custom-cursor-pointer"
              onClick={retryFetch}
            >
              <FontAwesomeIcon icon={faSync} /> Cliquez ici pour réessayer
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (room) {
    return (
      <div className="row justify-content-center">
        <div className="jumbotron col-lg-6">
          <h1 className="display-4 text-center mb-4">{room.name}</h1>
          <EventList
            selectedDate={new Date()}
            roomName={room.name}
            events={room.events}
            useToday={true}
          />
          <p className="mt-4 lead">
            <div className="row justify-content-center">
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onClickBookButton}
                >
                  Réserver cette salle
                </button>
              </div>
            </div>
          </p>
        </div>
      </div>
    );
  }

  return null;
};
