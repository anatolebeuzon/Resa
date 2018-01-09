const config = require("./translatorConfig").room;
const misc = require("./misc");

function newTranslationError(
  propertyName,
  roomName,
  roomId,
  untranslatedValue,
) {
  // Format translation errors that will be logged to help debug configuration issues
  return new Error(
    `${propertyName} could not be translated for room ${roomName} of ID ${roomId} (property value: ${untranslatedValue}). Check translatorConfig.json file`,
  );
}

function getPropertyValue(room, propertyName) {
  /*
  This functions gets this room's propertyName value and translates it
  into a human-readable value if needed (using translatorConfig.json)
  */

  const translator = config[propertyName];
  const rawValue = misc.getPropertyRawValue(room, translator.CodPro);

  // Check if rawValue is meaningful
  if (rawValue === null) return null;

  // Check if value needs translation or can be sent as is
  if (translator.ValPro === "getValueDirectly") {
    if (translator.valueType === "integer") {
      return Number(rawValue);
    } else if (translator.valueType === "string") {
      return rawValue;
    }
    throw new Error(
      `translatorConfig.json file should specify valueType: string or integer for property ${propertyName} because "getValueDirectly" is used`,
    );
  }

  // Check if config file can translate value
  if (translator.ValPro[rawValue] === undefined) {
    console.error(
      newTranslationError(propertyName, room.NomRes, room.NumRes, rawValue),
    );
    return null;
  }

  // Check if value needs translation from string to boolean
  if (translator.valueType === "boolean") {
    return translator.ValPro[rawValue] === "true";
  }

  // Return human-readable value
  return translator.ValPro[rawValue];
}

function parseRoom(room) {
  return {
    id: room.NumRes,
    name: room.NomRes,
    campus: getPropertyValue(room, "campus"),
    building: getPropertyValue(room, "building"),
    wing: getPropertyValue(room, "wing"),
    floor: getPropertyValue(room, "floor"),
    type: getPropertyValue(room, "type"),
    capacity: getPropertyValue(room, "capacity"),
    videoRecording: getPropertyValue(room, "videoRecording"),
    imageURL: getPropertyValue(room, "imageURL"),
    video: getPropertyValue(room, "video"),
    videoConference: getPropertyValue(room, "videoConference"),
    audioConference: getPropertyValue(room, "audioConference"),
    audio: getPropertyValue(room, "audio"),
    liveStreaming: getPropertyValue(room, "liveStreaming"),
    roomDelegate: getPropertyValue(room, "roomDelegate"),
    allowBookings: getPropertyValue(room, "allowBookings"),
    donator: getPropertyValue(room, "donator"),
  };
}

function parseRoomList(roomList) {
  // Check if there are rooms at all
  if (!roomList) return [];

  // Handle case when a single room is sent by GEODE: roomList needs
  // to be transformed into an array
  const arrayContent = Array.isArray(roomList) ? roomList : [roomList];

  return arrayContent.map(parseRoom);
}

module.exports = {
  parseRoomList,
  parseRoom,
};
