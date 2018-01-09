/*
Usage of this importer: in the CLI, typing "node importer.js pathToCsvFile"
will import all rooms in the file to GEODE.

Here is a sample CSV file that would work:
  campus;building;floor;name;type;capacity;donator;visio;projector
  Gif;Francis Bouygues;0;SC.0 46;Salle d'enseignement;120;;false;true
  Gif;Francis Bouygues;0;SC.0 07;Salle d'enseignement;30;;true;false
  ...

The CSV file is expected to use ";" as a delimiter, but you can tune this in
convertCSVtoJSON() below.
*/

const { promisify } = require("util");
const csv = require("csvtojson");
const _ = require("lodash");

const connect = require("../webservice/connect");
const search = require("../webservice/search");
const config = require("../webservice/translatorConfig").room;
const misc = require("../webservice/misc");

function convertCSVtoJSON(csvFilePath) {
  // Imports the CSV file and converts it to a JSON object

  if (!csvFilePath) throw new Error("path to CSV file not provided");

  const roomArray = [];

  return new Promise((resolve, reject) => {
    csv({ delimiter: ";" })
      .fromFile(csvFilePath)
      .on("json", jsonObj => {
        // combine CSV header row and CSV line to a JSON object
        roomArray.push(jsonObj);
      })
      .on("done", error => {
        if (error) {
          reject(error);
        } else {
          resolve(roomArray);
        }
      });
  });
}

/* Create a room object ready to be imported in GEODE */

function getValPro(property, value) {
  /*
  Translates a property from plain text to its corresponding GEODE ID,
  using translatorConfig.json
  */

  // Some fields, such as room capacity, are not based on key/value pairs
  // but contain directly the required information
  if (config[property].ValPro === "getValueDirectly") return value;

  const ValPro = _.findKey(
    config[property].ValPro,
    attribute => attribute === value,
  );

  if (!ValPro) throw new Error(`${value} is not a valid ${property}`);

  return ValPro;
}

function buildProperty(property, value) {
  //  Prepare a property for GEODE's format

  if (value === "" || value === undefined) {
    if (config[property].requiredForImport === "true") {
      throw new Error(`${property} must not be empty`);
    } else {
      return null;
    }
  }

  return {
    CodPro: config[property].CodPro,
    ValPro: getValPro(property, value),
  };
}

function getCategoryId(room) {
  /*
  Computes categoryId by using campus name

  The hierarchy in GEODE is expected to be the following:
  - campus A
    - room 1
    - room 2
    - ...
  - campus B
    - room 1
    - room 2
    - ...
  - ...

  */

  // Ensure location info is available
  if (!room.campus) {
    throw new Error("campus must not be empty");
  }

  const campusId = _.findKey(
    config.treeLocation,
    campus => campus === room.campus,
  );

  if (!campusId) throw new Error(`${room.campus} is not a valid campus`);

  return campusId;
}

function parseToXML(properties) {
  // Convert all properties to GEODE's XML format

  const xml = properties
    .map(property => {
      if (property.CodPro === undefined) {
        throw new Error(`${property} is not a valid property`);
      }
      return `<property code="${property.CodPro}" value="${
        property.ValPro
      }" />`;
    })
    .join("");
  return `<properties>${xml}</properties>`;
}

function formatRoom(room) {
  const propertiesToImport = [
    "campus",
    "building",
    "wing",
    "floor",
    "type",
    "capacity",
    "videoRecording",
    "video",
    "videoConference",
    "audioConference",
    "audio",
    "liveStreaming",
    "allowBookings",
    "donator",
  ];

  const properties = propertiesToImport
    .map(property => buildProperty(property, room[property]))
    .filter(item => item !== null);
  // Last line to filter out null items coming from optional properties without value (ex: capacity)

  if (!room.name) throw new Error("name must not be empty");

  return {
    name: room.name,
    categoryId: getCategoryId(room),
    properties: parseToXML(properties),
  };
}

/* Send to GEODE */

async function importRoomInGEODE(client, guid, room) {
  const response = await promisify(client.AddResource)({
    guid,
    communityId: 2,
    resourceTypeId: config.resourceType.id,
    groupId: 2,
    designation: room.name,
    categoryId: room.categoryId, // location in hierarchy
    properties: room.properties,
  });
  const result = misc.readXML(response.AddResourceResult).AddResource;

  // Analyze result
  if (result.resource.id === "-1") {
    // Error
    console.error(
      `Error while importing room ${room.name} to GEODE: `,
      result.errors.error.value,
    );
  } else {
    // Success
    console.log(
      `Successfully imported room ${room.name} to GEODE, with id ${
        result.resource.id
      }`,
    );
  }
}

async function updateRoomInGEODE(client, guid, room, originalId) {
  const response = await promisify(client.UpdateResource)({
    guid,
    communityId: 2,
    resourceId: originalId,
    designation: room.name,
    categoryId: room.categoryId, // location in hierarchy
    properties: room.properties,
  });
  const result = misc.readXML(response.UpdateResourceResult).UpdateResource;

  // Analyze result
  if (result.Errors) {
    // Error
    console.error(
      `Error while updating room ${room.name} in GEODE: `,
      result.Errors,
    );
  } else {
    // Success
    console.log(
      `Successfully UPDATED room ${room.name} in GEODE, with id ${originalId}`,
    );
  }
}

async function sendListToGEODE(csvFilePath) {
  try {
    // Load and format room list
    const roomArray = await convertCSVtoJSON(csvFilePath);
    const rooms = roomArray.map(formatRoom);
    console.log("Successfully formatted room list. Now connecting to GEODE...");

    // Initiate connection
    const [session, agendaClient] = await Promise.all([
      connect.newSession(),
      connect.getAgendaClient(),
    ]);

    // Get current rooms
    const existingRooms = await search.getAllRooms(agendaClient, session.guid);

    // Send all rooms to GEODE
    // NB: parallel requests resulted in connection timeout issues,
    // thus rooms are sent one after the other
    // eslint-disable-next-line
    for (const room of rooms) {
      // Check if a room with this exact name already exists
      const roomToUpdate = existingRooms.filter(
        existingRoom => existingRoom.name === room.name,
      )[0];
      if (roomToUpdate !== undefined) {
        // eslint-disable-next-line
        await updateRoomInGEODE(
          agendaClient,
          session.guid,
          room,
          roomToUpdate.id,
        );
      } else {
        // eslint-disable-next-line
        await importRoomInGEODE(agendaClient, session.guid, room);
      }
    }

    // Terminate connection
    connect.endSession(session);
  } catch (error) {
    console.error(error);
  }
}

sendListToGEODE(process.argv[2]);
