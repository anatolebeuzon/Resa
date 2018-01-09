import React from "react";
import ConfirmModal from "../../../../../../components/Modals/ConfirmModal";
import TimeChangeBody from "./components/TimeChangeBody";
import NameChangeBody from "./components/NameChangeBody";

export default ({
  event,
  modifType,
  sendUpdatedBooking,
  handleNameInputChange,
  handleDateInputChange,
  newAttributes,
  detectEnter,
  attemptedConfirm,
}) => {
  const body =
    modifType === "name" ? (
      <NameChangeBody
        event={event}
        handleNameInputChange={handleNameInputChange}
        eventName={newAttributes.eventName}
        detectEnter={detectEnter}
        attemptedConfirm={attemptedConfirm}
      />
    ) : (
      <TimeChangeBody
        event={event}
        handleDateInputChange={handleDateInputChange}
        newAttributes={newAttributes}
      />
    );

  return (
    <ConfirmModal
      title="Modification de votre réservation"
      body={body}
      confirmButtonText={
        <span>
          Modifier<span className="d-none d-sm-inline"> la réservation</span>
        </span>
      }
      confirmButtonFunction={sendUpdatedBooking}
      cancelActionText="Ne pas modifier"
    />
  );
};
