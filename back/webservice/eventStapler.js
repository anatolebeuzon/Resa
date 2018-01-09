const { promisify } = require("util");
const _ = require("lodash");
const moment = require("moment");

const misc = require("./misc");
const eventParser = require("./eventParser");

async function getRoomEventList(client, guid, roomList, selectedDate) {
  // roomList must be an array of integers: [roomId1, roomId2, roomId3, ...]
  // selectedDate must be in ISO 8601 string format

  // Convert selectedDate in AAAAMMJJ string format because GEODE requires it
  const formattedDate = moment(selectedDate)
    .utc()
    .format("YYYYMMDD");

  const response = await promisify(client.ListerEvenements)({
    guid,
    dateDebut: formattedDate,
    dateFin: formattedDate,
    // GEODE only accepts listeRessources as a string like "roomId1,roomId2,..."
    listeRessources: roomList.join(","),
  });
  const eventList = misc.readXML(response.ListerEvenementsResult);
  return eventParser.parseEventList(eventList.ROOT.EVE);
}

async function getPersonDetailsFromId(client, guid, userId) {
  const response = await promisify(client.DetailPersonne)({
    guid,
    idPersonne: userId,
    typePersonne: 26,
    listeChamps: "Nom",
  });

  const user = misc.readXML(response.DetailPersonneResult);

  return {
    id: user.Utilisateur.Id,
    firstName: user.Utilisateur["Prénom"],
    lastName: user.Utilisateur.Nom,
    email: user.Utilisateur.Email,
  };
}

function stapleRoomEventsUsers(room, events, users) {
  /*
  events is an array of events for multiple rooms
  This function extract the events for this specific room,
  and returns a new room object with an "events" attribute
  */

  // Duplicate room object to avoid parameters reassignment
  const roomWithEvents = room;

  // Find the events for this specific room
  roomWithEvents.events = events
    .filter(event => event.roomId === room.id)
    .map(event => {
      const eventWithAuthor = event;

      // Add author details to event
      eventWithAuthor.author = _.find(users, ["id", event.authorId]);

      // Remove useless authorId field (because duplicated in author.id)
      delete eventWithAuthor.authorId;

      // Remove useless roomId field (because duplicated in parent room.id)
      delete eventWithAuthor.roomId;

      return eventWithAuthor;
    });

  return roomWithEvents;
}

async function stapleToRoomList(
  agendaClient,
  annuaireClient,
  guid,
  rooms,
  selectedDate,
) {
  /*
  This functions takes in argument an array of rooms (formatted by roomParser)
  and returns a similar array, with an additional "events" property on each
  room of the array. This events property contains an array of events
  (formatted by eventParser). For each event, the user who made the booking is
  available in an "author" property.
  */

  // Download events for the selected date to rooms
  const events = await getRoomEventList(
    agendaClient,
    guid,
    rooms.map(room => room.id),
    selectedDate,
  );

  // Get details (name, email...) of users who booked a room for the selected date
  const users = await Promise.all(
    _.uniq(events.map(event => event.authorId)).map(authorId =>
      getPersonDetailsFromId(annuaireClient, guid, authorId),
    ),
  );

  // Staple events and users to rooms
  return rooms.map(room => stapleRoomEventsUsers(room, events, users));
}

function stapleToBookingList(agendaClient, annuaireClient, guid, bookingList) {
  /*
  This functions serves the same purpose as stapleToRoomList(), but for a
  list of bookings (thus with variable dates to look for events)
  */

  return Promise.all(
    bookingList.map(async booking => {
      // Duplicate room object to avoid parameters reassignment
      const newBooking = booking;

      [newBooking.room] = await stapleToRoomList(
        agendaClient,
        annuaireClient,
        guid,
        [booking.room],
        booking.startDate,
      );

      return newBooking;
    }),
  );
}

module.exports = { stapleToRoomList, stapleToBookingList };
