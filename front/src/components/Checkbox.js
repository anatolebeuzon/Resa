import React from "react";

export default ({ checked, onChange, name }) => (
  <div className="custom-control custom-checkbox">
    <input
      type="checkbox"
      className="custom-control-input"
      id={name}
      checked={checked}
      onChange={onChange}
    />
    <label className="custom-control-label" htmlFor={name}>
      {"  "} {name}
    </label>
  </div>
);
