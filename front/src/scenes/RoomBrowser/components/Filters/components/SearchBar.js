import React from "react";

import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/fontawesome-free-solid";

export default ({ searchText, onSearchTextInput }) => (
  <div className="input-group mr-sm-2 mb-sm-0">
    <div className="input-group-prepend">
      <span className="input-group-text">
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </div>
    <input
      className="form-control"
      type="text"
      placeholder="essayez &laquo; musique &raquo;, &laquo; lc &raquo;..."
      value={searchText}
      onChange={e => onSearchTextInput(e.target.value)}
    />
  </div>
);
