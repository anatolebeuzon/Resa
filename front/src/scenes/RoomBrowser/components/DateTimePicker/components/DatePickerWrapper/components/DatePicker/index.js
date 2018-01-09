import React from "react";
import Dimensions from "react-dimensions";
import { number, func } from "prop-types";

import InfiniteCalendar from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";

import theme from "./DatePickerTheme";

const frLocale = require("date-fns/locale/fr");

const locale = {
  blank: "Sélectionnez une date :",
  headerFormat: "dddd, D MMM",
  locale: frLocale,
  todayLabel: {
    long: "Aujourd'hui",
    short: "Auj.",
  },
  weekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
  weekStartsOn: 1, // Start the week on Monday
};

class DatePicker extends React.PureComponent {
  static propTypes = {
    containerWidth: number,
    handleDateSelect: func.isRequired,
  };

  static defaultProps = {
    containerWidth: 300,
  };

  render() {
    const today = new Date();

    return (
      <InfiniteCalendar
        width={this.props.containerWidth}
        height={300}
        selected={false}
        minDate={today}
        locale={locale}
        theme={theme}
        onSelect={this.props.handleDateSelect}
      />
    );
  }
}

export default Dimensions()(DatePicker);
