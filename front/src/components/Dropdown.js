import React from "react";

export default ({ onChange, valueArray, currentValue }) => (
  <select
    className="custom-select custom-width-auto mx-2"
    onChange={onChange}
    value={currentValue}
  >
    {valueArray.map(value => (
      <option value={value} key={value}>
        {value}
      </option>
    ))}
  </select>
);
