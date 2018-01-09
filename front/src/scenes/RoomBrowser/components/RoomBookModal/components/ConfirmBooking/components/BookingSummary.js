import React from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/fontawesome-free-solid";

const moment = require("moment");
require("moment/locale/fr");

export default ({ selectedDate, startTime, endTime }) => (
  <div className="row align-items-center justify-content-left no-gutters my-4">
    <div className="col-lg-3">Créneau demandé :</div>
    <div className="col-lg-9 text-primary custom-text-center-under-lg">
      {moment(selectedDate).format("dddd D MMMM")}
      <br />
      {startTime.format("H[h]mm")} <FontAwesomeIcon icon={faAngleRight} />{" "}
      {endTime.format("H[h]mm")}
    </div>
  </div>
);
