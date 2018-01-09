import React from "react";

export default ({ roomName, showActionSelector }) => (
  <div className="row justify-content-center">
    <div
      className="col-lg-6 alert alert-secondary text-center custom-hover-darkens"
      role="alert"
      onClick={showActionSelector}
    >
      Salle sélectionnée : <span className="font-weight-bold">{roomName}</span>
    </div>
  </div>
);
