import React from "react";
import moment from "moment";
import recapitalize from "../services/recapitalize";

export default ({
  selectedDate,
  roomName,
  events,
  highlightedEvent = -1,
  useToday = false
}) => {
  if (events.length === 0) {
    return (
      <h6>
        Aucun évènement n'est prévu
        {!useToday && ` le ${moment(selectedDate).format("D MMMM")} `}
        {useToday && " aujourd'hui "}
        en {roomName}.
      </h6>
    );
  }
  return (
    <div>
      <h6>
        {events.length === 1 && `Un seul évènement est prévu`}
        {events.length >= 2 && `${events.length} évènements sont prévus`}
        {!useToday && ` le ${moment(selectedDate).format("D MMMM")} `}
        {useToday && " aujourd'hui "}
        en {roomName} :
      </h6>
      <div className="list-group mt-3">
        {events.map(event => {
          const isHighlighted = event.id === highlightedEvent;
          return (
            <div
              className={`list-group-item flex-column align-items-start ${
                isHighlighted ? "active" : ""
              }`}
              key={event.id}
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{event.name}</h5>
                <span className={!isHighlighted ? "text-muted" : ""}>
                  {"de "}
                  {moment(event.startDate)
                    .utc()
                    .format("H[h]mm")}
                  {" à "}
                  {moment(event.endDate)
                    .utc()
                    .format("H[h]mm")}
                </span>
              </div>
              <span className={!isHighlighted ? "text-muted" : ""}>
                Réservé par{" "}
                <a
                  className={!isHighlighted ? "text-secondary" : "text-white"}
                  href={`mailto:${event.author.email}`}
                >
                  {recapitalize(event.author.firstName)}{" "}
                  {recapitalize(event.author.lastName)}
                </a>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
