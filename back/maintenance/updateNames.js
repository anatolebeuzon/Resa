/*
This script was created to update room names in GEODE.
For instance, room E.176 would be updated to e.176
*/

const { promisify } = require("util");
const _ = require("lodash");

const connect = require("../webservice/connect");
const search = require("../webservice/search");
const config = require("../webservice/translatorConfig").room;
const misc = require("../webservice/misc");

function renameRoomName(originalRoomName) {
  return originalRoomName.toLowerCase();
}

// eslint-disable-next-line
function retrieveCategoryId(room) {
  // Use this function in case categoryId was lost
  // Only works for Francis Bouygues rooms, excluding rooms like [0-C-REU-0002]

  const roomCampus = "Saclay";
  const roomBuilding = "Francis Bouygues";
  const roomWing = room.name.substring(0, 1);
  console.log("computed roomWing: ", roomWing);

  const dotIndex = room.name.indexOf(".");
  const roomFloor = room.name.substring(dotIndex + 1, dotIndex + 2);
  console.log("computed roomFloor: ", roomFloor);

  const campusId = _.findKey(
    config.location.campus,
    campus => campus.name === roomCampus
  );

  if (!campusId) throw new Error(`${roomCampus} is not a valid campus`);

  const buildingId = _.findKey(
    config.location.campus[campusId].building,
    building => building.name === roomBuilding
  );

  if (!buildingId) throw new Error(`${roomBuilding} is not a valid building`);

  let wingId;

  if (roomWing) {
    wingId = _.findKey(
      config.location.campus[campusId].building[buildingId].wing,
      wing => wing.name === roomWing
    );
  } else {
    wingId = _.findKey(
      config.location.campus[campusId].building[buildingId].wing,
      wing => wing.name === "singleWing"
    );
  }

  if (!wingId) throw new Error(`${roomWing} is not a valid wing`);

  const floorId = _.findKey(
    config.location.campus[campusId].building[buildingId].wing[wingId].floor,
    floor => floor === roomFloor
  );

  if (!floorId) throw new Error(`${roomFloor} is not a valid floor`);

  return floorId;
}

async function updateRoomNameInGEODE(client, guid, room) {
  const newName = renameRoomName(room.name);
  const response = await promisify(client.UpdateResource)({
    guid,
    communityId: 2,
    resourceId: room.id,
    designation: newName,
    categoryId: -1
  });
  const result = misc.readXML(response.UpdateResourceResult).UpdateResource;

  // Analyze result
  if (result.Errors) {
    // Error
    console.error(
      `Error while updating room ${room.name} in GEODE: `,
      result.Errors
    );
  } else {
    // Success
    console.log(
      `Successfully renamed room ${room.name} to ${newName} in GEODE`
    );
  }
}

async function updateInGEODE() {
  try {
    // Initiate connection
    const [session, agendaClient] = await Promise.all([
      connect.newSession(),
      connect.getAgendaClient()
    ]);

    // List rooms to update
    const roomsToUpdate = (await search.getAllRooms(agendaClient, session.guid))
      .filter(room => room.building === "Francis Bouygues")
      .filter(room => room.name.substring(0, 1) !== "[");
    // Exclude rooms with name such as [0-C-REU-0002]

    // Use this in case categoryId was lost:
    // const roomsToUpdate = (await search.getAllRooms(agendaClient, session.guid))
    //                               .filter(room => room.building === null)
    //                               .filter(room => room.name.substring(0,1) !== "[");

    // Update rooms in GEODE
    // NB: parallel requests resulted in connection timeout issues,
    // thus rooms are sent one after the other
    // eslint-disable-next-line
    for (const room of roomsToUpdate) {
      // eslint-disable-next-line
      await updateRoomNameInGEODE(agendaClient, session.guid, room);
    }

    // Terminate connection
    connect.endSession(session);
  } catch (error) {
    console.error(error);
  }
}

updateInGEODE();
