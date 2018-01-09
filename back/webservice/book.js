const { promisify } = require("util");
const _ = require("lodash");
const moment = require("moment");

const config = require("../config");
const eventConfig = require("./translatorConfig").event;
const eventParser = require("./eventParser");
const search = require("./search");
const misc = require("./misc");
const eventStapler = require("./eventStapler");

// Required by GEODE
const eventType = "RDV";

async function addEvent(
  client,
  guid,
  eventName,
  authorId,
  startDate,
  endDate,
  resourceId,
) {
  // startDate and endDate must be ISO string dateTime objects

  // addEvent returns true if booking succeeded, false if room was unavailable,
  // and throws an error if some other error occured

  const response = await promisify(client.AjouterEvenementAvecContraintes)({
    guid,
    nomEve: eventName,
    typeEve: eventType,
    statut: eventConfig.active,
    idAuteur: authorId,
    dateDebut: startDate,
    dateFin: endDate,
    participantsSouhaites: authorId.toString(),
    participantsObligatoires: "",
    formateurs: "",
    apprenants: "",
    organismes: "",
    ressources: resourceId.toString(),
  });

  const result = response.AjouterEvenementAvecContraintesResult;

  if (result.IdEvenement !== undefined) {
    return result.IdEvenement;
  } else if (result.ERREUR !== undefined) {
    throw new Error(result.ERREUR);
  } else if (result.ROOT.INDISPO) {
    return -1;
  } else {
    throw new Error(`an unknown error occured while creating event`);
  }
}

async function cancelEvent(client, guid, eventId) {
  // TODO: prevent cancelling of ended events

  const response = await promisify(client.SupprimerEvenement)({
    guid,
    idEve: eventId,
  });

  if (
    !response.SupprimerEvenementResult.IdEvenement ||
    response.SupprimerEvenementResult.IdEvenement !== eventId.toString()
  ) {
    throw new Error(
      `Failed to cancel event: ${response.SupprimerEvenementResult.ERREUR}`,
    );
  }
}

async function modifyEvent(
  client,
  guid,
  eventId,
  newEventName,
  authorId,
  newStartDate,
  newEndDate,
  resourceId,
) {
  const response = await promisify(client.ModifierEvenementAvecContraintes)({
    guid,
    idEve: eventId,
    nomEve: newEventName,
    typeEve: eventType,
    statut: eventConfig.active,
    idAuteur: authorId,
    dateDebut: newStartDate,
    dateFin: newEndDate,
    participantsSouhaites: authorId.toString(),
    participantsObligatoires: "",
    formateurs: "",
    apprenants: "",
    organismes: "",
    ressources: resourceId.toString(),
  });

  const result = response.ModifierEvenementAvecContraintesResult;

  if (!result.IdEvenement || result.IdEvenement !== eventId.toString()) {
    if (result.ROOT && result.ROOT.INDISPO) {
      // Tell upper function that room is unavailable at the specified time
      return false;
    }
    throw new Error(`Failed to modify event: ${result.ERREUR}`);
  }
  // Tell upper function that modification was a success
  return true;
}

async function getPersonList(client, guid) {
  const response = await promisify(client.ListerAnnuaire)({
    guid,
    idAnnuaire: 2,
    listeTypesPersonnes: "25",
    taillePage: 65535,
    numeroPage: 1,
  });

  return misc.readXML(response.ListerAnnuaireResult);
}

async function getPersonIdFromEmail(client, guid, email) {
  /*
  If in development mode, use specific Geode account because emails may not
  be correctly filled in Geode's dev environment
  */
  if (process.env.CONFIG_ENV === "dev") {
    return config.devGeodeUserId;
  }

  // TODO: change to use InterrogerAnnuaireDetails
  const response = await promisify(client.InterrogerAnnuaire)({
    guid,
    idAnnuaire: 2,
    requete: `SELECT p FROM OpenPortal.Noyau.PersonnePhysique p WHERE p.Email = "${
      email
    }"`,
    taillePage: 65535,
    numeroPage: 1,
  });

  const formattedResult = misc.readXML(response.InterrogerAnnuaireResult);
  const content = formattedResult.contenu;

  if (content !== undefined) {
    if (content.Utilisateur === undefined) {
      // could not find any user with this email in GEODE
      // Return -1 to handle this gracefully in the UI
      return -1;
    } else if (
      Array.isArray(content.Utilisateur) &&
      content.Utilisateur.length > 1
    ) {
      throw new Error(
        `${content.Utilisateur.length} users were found in GEODE with email ${
          email
        }, instead of only one`,
      );
    } else {
      return content.Utilisateur.Id;
    }
  } else {
    throw new Error(formattedResult);
  }
}

async function addRoomToEvent(client, guid, event) {
  const newEvent = event;
  newEvent.room = await search.getRoomDetail(client, guid, event.roomId);
  return newEvent;
}

function isEventPastOrFuture(event) {
  if (event.endDate.isSameOrAfter(moment())) return "future";
  return "past";
}

async function getPersonEventList(agendaClient, guid, personId) {
  /*
  Returns a person's events
  Raw because unparsed
  */
  const response = await promisify(agendaClient.ListerEvenements)({
    guid,
    listeSouhaites: personId.toString(),
    listeStatuts: eventConfig.active,
  });

  const eventList = misc.readXML(response.ListerEvenementsResult);
  return eventParser.parseEventList(eventList.ROOT.EVE);
}

async function getStapledPersonEventList(
  agendaClient,
  annuaireClient,
  guid,
  personId,
) {
  // TODO: use dateDebut so that GEODE filters out bookings older than 3 months
  const eventList = await getPersonEventList(agendaClient, guid, personId);

  // Staple rooms with events
  // This allows the front-end to show the room details in a user's bookings list
  let parsedEvents = await Promise.all(
    eventList.map(event => addRoomToEvent(agendaClient, guid, event)),
  );

  // Filter out unwanted events
  parsedEvents = parsedEvents
    .filter(event => event.room !== null) // Filter out events about rooms that don't exist anymore in GEODE
    .filter(event => event.endDate.isAfter(moment().subtract(3, "months"))); // Filter out past bookings older than 3 months old

  // Group past and future events separately
  parsedEvents = _.groupBy(parsedEvents, isEventPastOrFuture);
  if (parsedEvents.past) {
    parsedEvents.past = parsedEvents.past.reverse();
  }

  // Staple bookings of other people
  // This allows the front-end to show the list of events when trying to modify
  // the chosen hours
  if (parsedEvents.future !== undefined) {
    // if there are future bookings
    parsedEvents.future = await eventStapler.stapleToBookingList(
      agendaClient,
      annuaireClient,
      guid,
      parsedEvents.future,
    );
  }

  // Convert to an array
  parsedEvents = misc.convertToArray(parsedEvents);

  // Show future events before past events
  parsedEvents = parsedEvents.reverse();

  return parsedEvents;
}

async function ensureEventBelongsToUser(agendaClient, guid, personId, eventId) {
  /*
  Throws an error if eventId is not in the list of a user's events, that is to
  say if a user does not have the right to modify/cancel this booking
  */
  const eventIdsList = (await getPersonEventList(
    agendaClient,
    guid,
    personId,
  )).map(event => event.id);

  // if unauthorized
  if (eventIdsList.indexOf(eventId) === -1) {
    throw new Error(
      `Unauthorized booking modification/cancelling attempt: event #${
        eventId
      } does not belong to user #${personId}`,
    );
  }
}

module.exports = {
  addEvent,
  cancelEvent,
  modifyEvent,
  getPersonList,
  getPersonIdFromEmail,
  getStapledPersonEventList,
  ensureEventBelongsToUser,
};
