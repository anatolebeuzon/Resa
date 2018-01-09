import moment from "moment";

export default (date, startTime, endTime) => {
  const formattedDate = {};
  formattedDate.start = moment(
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTime.hours(),
      startTime.minutes(),
    ),
  ).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
  formattedDate.end = moment(
    new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      endTime.hours(),
      endTime.minutes(),
    ),
  ).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");

  return formattedDate;
};
