// Necessary for auto resize of react-infinite-calendar on window resize
import React from "react";
import { Collapse } from "react-collapse";

import DatePicker from "./components/DatePicker";

export default ({ isOpened, handleDateSelect, selectedDate }) => (
  <Collapse isOpened={isOpened}>
    <div className="row justify-content-center no-gutters">
      <div className="col-md-6">
        <div className="card mb-3">
          <div className="card-body p-0">
            <DatePicker
              handleDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  </Collapse>
);
