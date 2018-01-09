const moment = require("moment");

const config = require("./translatorConfig").event;
const misc = require("./misc");

function compareStartDate(event1, event2) {
  if (event1.startDate.isSameOrAfter(event2.startDate)) return 1;
  return -1;
}

function getEventType(event) {
  // Translates event type to human-readable value using translatorConfig.json
  return config.type[event.TypEve] === undefined
    ? null
    : config.type[event.TypEve];
}

function parseEvent(event) {
  // Build Date objects startDate and endDate
  const startTime = misc.getPropertyRawValue(event, config.startTime.CodPro);
  const endTime = misc.getPropertyRawValue(event, config.endTime.CodPro);
  const date = misc.getPropertyRawValue(event, config.date.CodPro);

  const startDate = moment.utc(`${date}T${startTime}`);
  const endDate = moment.utc(`${date}T${endTime}`);

  return {
    id: event.NumEve,
    name: event.NomEve,
    type: getEventType(event),
    // ComEve: never figured out the meaning of this GEODE field
    roomId: misc.getPropertyRawValue(event, config.resource.CodPro),
    authorId: misc.getPropertyRawValue(event, config.author.CodPro),
    startDate,
    endDate,
  };
}

function parseEventList(eventList) {
  // Check if there are events at all
  if (!eventList) return [];

  // Handle case when a single event is sent by GEODE: eventList needs
  // to be transformed into an array
  const arrayContent = Array.isArray(eventList) ? eventList : [eventList];

  return arrayContent
    .filter(event => event.EtaEve === config.active) // Only keep active events
    .map(parseEvent)
    .sort(compareStartDate); // Sort events by chronological order
}

module.exports = {
  parseEventList,
  parseEvent,
};
