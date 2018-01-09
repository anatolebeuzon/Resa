const { promisify } = require("util");
const _ = require("lodash");

const roomParser = require("./roomParser");

const misc = require("./misc");
const eventStapler = require("./eventStapler");
const config = require("./translatorConfig").room;

async function getAllRooms(client, guid) {
  const response = await promisify(client.ListerRessources)({ guid });
  const resourceList = misc.readXML(response.ListerRessourcesResult);
  return roomParser.parseRoomList(resourceList.ROOT.RES);
}

async function getRoomDetail(client, guid, idRessource) {
  const response = await promisify(client.DetailRessource)({
    guid,
    idRessource
  });
  const resource = misc.readXML(response.DetailRessourceResult);
  if (resource.RES !== undefined) {
    return roomParser.parseRoom(resource.RES);
  }
  return null;
}

async function getRoomDetailWithEvents(
  agendaClient,
  annuaireClient,
  guid,
  idRessource,
  selectedDate
) {
  const room = await getRoomDetail(agendaClient, guid, idRessource);
  const roomWithEvents = (await eventStapler.stapleToRoomList(
    agendaClient,
    annuaireClient,
    guid,
    [room],
    selectedDate
  ))[0];

  return roomWithEvents;
}

async function getAvailableRoomIds(client, guid, startDate, endDate) {
  /*
  Returns an array of roomId of available rooms: [id1, id2, ...]

  startDate and endDate must be in ISO 8601 string format.
  To convert a date object to an ISO 8601 string, use : date.toISOString()
  */

  // Get all categories
  const categorieRes = Object.keys(config.treeLocation).join(",");

  const response = await promisify(client.ListerRessourcesPourPeriode)({
    guid,
    typeRes: config.resourceType.code,
    categorieRes,
    dateDebut: startDate,
    dateFin: endDate
  });

  return response.ListerRessourcesPourPeriodeResult.Root.Res.map(
    room => room.NumRes
  );
}

function compareCapacity(room1, room2) {
  if (Number(room1.capacity) > Number(room2.capacity)) {
    return 1;
  } else if (Number(room1.capacity) < Number(room2.capacity)) {
    return -1;
  }
  return 0;
}

async function getAvailableRooms(
  agendaClient,
  annuaireClient,
  guid,
  startDate,
  endDate,
  // If only looking for the result for one particular room, filter by this room ID:
  selectedRoomId = null
) {
  /*
  startDate and endDate must be in ISO 8601 string format.
  To convert a date object to an ISO 8601 string, use : date.toISOString()
  */

  const [rooms, availableIds] = await Promise.all([
    getAllRooms(agendaClient, guid),
    getAvailableRoomIds(agendaClient, guid, startDate, endDate)
  ]);

  const filteredRooms = rooms
    // If selectedRoomId is not null, filter by this room ID
    .filter(room => {
      if (selectedRoomId) return room.id === selectedRoomId;
      return true;
    })
    // Filter out rooms that are not allowed for booking
    .filter(room => room.allowBookings)
    .map(room => {
      // Duplicate room object to avoid parameters reassignment
      const roomWithAvailability = room;

      // Add an 'available' property to say if the room is available at the specified timespan
      roomWithAvailability.available = availableIds.indexOf(room.id) !== -1;
      return roomWithAvailability;
    })
    // Sort by capacity
    .sort(compareCapacity);

  const roomsWithEvents = await eventStapler.stapleToRoomList(
    agendaClient,
    annuaireClient,
    guid,
    filteredRooms,
    startDate
  );

  // Group by building
  return misc.convertToArray(_.groupBy(roomsWithEvents, "building"));
}

module.exports = {
  getRoomDetail,
  getRoomDetailWithEvents,
  getAllRooms,
  getAvailableRooms
};
