import React from "react";
import OptionalImage from "react-image";

import ConfirmModal from "../../../../../../components/Modals/ConfirmModal";
import EventList from "../../../../../../components/EventList";
import BookingSummary from "./components/BookingSummary";
import EventNameInput from "./components/EventNameInput";
import config from "../../../../../../config";

const imageExtension = "jpg";

export default ({
  room,
  selectedDate,
  startTime,
  endTime,
  confirmBooking,
  eventName,
  handleEventNameInputChange,
  attemptedConfirm,
  detectEnter,
}) => {
  const body = [
    <OptionalImage
      src={`${config.imagesBaseURL}${room.id}.${imageExtension}`}
      className="img-fluid mb-4"
      alt={`Photo de la salle ${room.name}`}
      key="image"
    />,
    <div className="mb-4" key="eventList">
      <EventList
        selectedDate={selectedDate}
        roomName={room.name}
        events={room.events}
      />
    </div>,
    <BookingSummary
      selectedDate={selectedDate}
      startTime={startTime}
      endTime={endTime}
      key="bookingSummary"
    />,
    <EventNameInput
      available={room.available}
      eventName={eventName}
      handleEventNameInputChange={handleEventNameInputChange}
      detectEnter={detectEnter}
      attemptedConfirm={attemptedConfirm}
      key="eventNameInput"
    />,
  ];

  return (
    <ConfirmModal
      title={`Réservation de la salle ${room.name}`}
      body={body}
      confirmButtonText={
        <span>
          Confirmer<span className="d-none d-sm-inline"> la réservation</span>
        </span>
      }
      confirmButtonFunction={confirmBooking}
      showConfirmButton={room.available}
      cancelActionText={room.available ? "Annuler" : "OK"}
    />
  );
};
