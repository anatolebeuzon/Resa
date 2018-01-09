import React from "react";
import InputSlider from "react-input-slider";

export default ({ minCapacity, onChange }) => (
  <div>
    <div className="row mt-3">Nombre de personnes :</div>
    <div className="row mb-4 align-items-center">
      <div className="col-9 pr-0">
        <InputSlider
          className="u-slider-time"
          x={minCapacity}
          onChange={onChange}
          xmin={0}
          xmax={50}
        />
      </div>
      <div className="col-3 text-right pl-0">
        <strong>{minCapacity}</strong>
      </div>
    </div>
  </div>
);
