import React from "react";
import ReactTooltip from "react-tooltip";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

export default ({ handleClick, tooltip, icon }) => (
  <button
    type="button"
    className="btn btn-primary mr-3"
    onClick={handleClick}
    data-tip={tooltip}
    data-for={`date-time-button-${icon}`}
  >
    <FontAwesomeIcon icon={icon} />
    <ReactTooltip
      id={`date-time-button-${icon}`}
      effect="solid"
      place="bottom"
    />
  </button>
);
