const ics = require("ics");
const { promisify } = require("util");

function ISOtoArray(ISOstring) {
  // Since ICS v2.0, "start" and "end" date are expected to be in an array
  // format (for example: [2018, 5, 30, 6, 30])

  const d = new Date(ISOstring);

  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ];
}

function createEvent(
  eventId,
  eventName,
  startDate,
  endDate,
  roomName,
  roomBuilding,
  roomWing,
  friendlyFloor,
  user,
) {
  return promisify(ics.createEvent)({
    uid: eventId, // (optional)
    start: ISOtoArray(startDate),
    end: ISOtoArray(endDate),
    title: eventName,
    description: `Salle ${roomName}\\nBâtiment ${roomBuilding}\\nUnivers ${roomWing}\\n${friendlyFloor}\\n\\nRéservé en ligne via Resa\\nPour annuler, rendez-vous sur resa.centralesupelec.fr`,
    location: `Salle ${roomName} du bâtiment ${roomBuilding}`,
    url: "https://resa.centralesupelec.fr/reservations",
    status: "CONFIRMED",
    organizer: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    },
    categories: [],
    alarms: [],
  });
}

module.exports = { createEvent };
