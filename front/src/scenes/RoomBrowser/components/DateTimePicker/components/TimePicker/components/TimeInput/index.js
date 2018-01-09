/*
Adapted from NPM module input-moment.
*/

import cx from "classnames";
import React, { Component } from "react";
import InputSlider from "react-input-slider";
import { instanceOf, func } from "prop-types";
import moment from "moment";

import "./TimeInput.css";

export default class InputMoment extends Component {
  static propTypes = {
    moment: instanceOf(moment).isRequired,
    onChange: func.isRequired,
  };

  changeHours = pos => {
    const m = this.props.moment;
    const intPos = Math.floor(pos.x);
    m.minutes(parseInt((intPos % 4) * 15, 10));
    m.hours(parseInt((intPos - intPos % 4) / 4, 10));
    this.props.onChange(m);
  };

  render() {
    const m = this.props.moment;

    return (
      <div className={`${cx("m-time")} pt-0  mb-5`}>
        <div className="row justify-content-center">
          <div className="showtime">
            <span className="time">{m.format("HH")}</span>
            <span className="separater">h</span>
            <span className="time">{m.format("mm")}</span>
          </div>
        </div>

        <div className="sliders">
          <div className="row mt-5">
            <InputSlider
              className="u-slider-time"
              xmin={28}
              xmax={92}
              x={m.hour() * 4 + m.minutes() / 15}
              onChange={this.changeHours}
            />
          </div>
        </div>
      </div>
    );
  }
}
