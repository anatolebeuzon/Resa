/*
Usage of this importer: in the CLI, typing "node exportResourceList.js exportPath"
will export all rooms of the specified campus in a CSV file.
*/

const connect = require("../webservice/connect");
const search = require("../webservice/search");
const json2csv = require("json2csv");
const fs = require("fs");

const attributesToExport = [
  "id",
  "name",
  "building",
  "wing",
  "floor",
  "type",
  "allowBookings",
  "donator",
];

async function exportRooms() {
  const exportPath = process.argv[2];
  if (!exportPath) {
    throw new Error(
      "Export path not specified. Usage: node exportResourceList.js exportPath",
    );
  }

  // Initiate connection
  const [session, agendaClient] = await Promise.all([
    connect.newSession(),
    connect.getAgendaClient(),
  ]);

  // Get current rooms
  const rooms = await search.getAllRooms(agendaClient, session.guid);

  try {
    const csvData = json2csv({ data: rooms, fields: attributesToExport });

    fs.writeFile(exportPath, csvData, err => {
      // throws an error, you could also catch it here
      if (err) throw err;
      // success case, the file was saved
      console.log("Export succeeded!");
    });
  } catch (error) {
    console.error(error);
  }
}

exportRooms();
