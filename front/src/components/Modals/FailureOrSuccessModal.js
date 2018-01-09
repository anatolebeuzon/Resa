import React from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/fontawesome-free-solid";

import Modal from "./components/Modal";

export default ({ isAFailureModal, title, bodyText, redirectFunction }) => {
  const style = {};
  if (isAFailureModal) {
    // this modal displays a failure
    style.icon = faTimes;
    style.iconColor = "#D03B3B";
    style.button = "btn-secondary";
  } else {
    // this modal displays a success
    style.icon = faCheck;
    style.iconColor = "#4AAE46";
    style.button = "btn-success";
  }

  const body = (
    <div className="row align-items-center justify-content-start">
      <div className="col-sm-2 custom-text-center-under-sm">
        <FontAwesomeIcon
          icon={style.icon}
          size="4x"
          style={{ color: style.iconColor }}
        />
      </div>
      <div className="col-sm-9 custom-text-center-under-sm">{bodyText}</div>
    </div>
  );

  const footer = (
    <button
      type="button"
      className={`btn ${style.button}`}
      data-dismiss="modal"
      aria-label="Close"
      onClick={redirectFunction}
    >
      OK
    </button>
  );

  return <Modal title={title} body={body} footer={footer} />;
};
