import React from "react";

export default ({ onChange, data, selectedType }) => (
  <div>
    {data.options.map(({ value, fullName }) => (
      <div key={value} className="custom-control custom-radio mb-1">
        <input
          className="custom-control-input"
          type="radio"
          name="type"
          id={value || "all"}
          value={value}
          onChange={onChange}
          checked={value === selectedType}
        />
        <label className="custom-control-label" htmlFor={value || "all"}>
          {"  "} {fullName}
        </label>
      </div>
    ))}
  </div>
);
