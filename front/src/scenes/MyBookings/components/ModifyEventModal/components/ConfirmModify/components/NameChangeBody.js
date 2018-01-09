import React from "react";
import BookingSummary from "./components/BookingSummary";

export default ({
  event,
  handleNameInputChange,
  eventName,
  detectEnter,
  attemptedConfirm,
}) => [
  <div
    className={attemptedConfirm ? "form-group was-validated" : "form-group"}
    key="eventNameForm"
  >
    <label htmlFor="eventName">Titre de l'évènement :</label>
    <input
      type="text"
      className={eventName ? "form-control valid" : "form-control invalid"}
      id="eventName"
      value={eventName}
      onChange={handleNameInputChange}
      onKeyPress={detectEnter}
      required
    />
    <div className="invalid-feedback">
      Veuillez indiquer l'objet de l'évènement
    </div>
  </div>,
  <div className="text-center" key="eventDetails">
    <BookingSummary event={event} />
  </div>,
];
