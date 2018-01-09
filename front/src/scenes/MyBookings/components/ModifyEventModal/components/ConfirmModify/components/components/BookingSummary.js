import React from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/fontawesome-free-solid";

const moment = require("moment");
require("moment/locale/fr");

export default ({ event }) => (
  <div className="text-primary">
    Salle {event.room.name}
    <br />
    {moment(event.startDate)
      .utc()
      .format("dddd D MMMM")}
    <br />
    {moment(event.startDate)
      .utc()
      .format("H[h]mm")}{" "}
    <FontAwesomeIcon icon={faAngleRight} />{" "}
    {moment(event.endDate)
      .utc()
      .format("H[h]mm")}
  </div>
);
