const ical = require("node-ical");
const _ = require("lodash");
const moment = require("moment");

const connect = require("../webservice/connect");
const book = require("../webservice/book");
const config = require("./eventImporterConfig");

const calendarPath = "./calendars/Vincent-Jolys.ics";

async function getPersonObject(client, guid, email) {
  return {
    email,
    id: await book.getPersonIdFromEmail(client, guid, email),
  };
}

function formatDate(date, isEndDate = false) {
  const newDate = moment(new Date(date));

  // Workaround for a bug in GEODE:
  // if an event starts on midnight and ends on midnight of the following day,
  // GEODE creates an event starting on midnight and ending on midnight of
  // the same day (yes, a 0-minute event -_-)
  if (isEndDate && newDate.hours() === 0 && newDate.minutes() === 0) {
    newDate.subtract(1, "minutes");
  }

  return newDate.format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
}

async function importEvents() {
  // Read and parse ICS calendar
  const data = ical.parseFile(calendarPath);

  const eventType = "RDV";

  // Extract events from calendar
  const events = Object.values(data).filter(object => object.type === "VEVENT");

  try {
    // Connect to GEODE
    const [session, agendaClient, annuaireClient] = await Promise.all([
      connect.newSession(),
      connect.getAgendaClient(),
      connect.getAnnuaireClient(),
    ]);

    // List event organizers and get their GEODE id (once per organizer)
    const organizers = await Promise.all(
      _.uniqBy(
        events.map(event => event.organizer.val.substring(7)),
      ).map(email => getPersonObject(annuaireClient, session.guid, email)),
    );

    // Check for unknown rooms
    // eslint-disable-next-line
    for (const event of events) {
      if (config.locations[event.location] === undefined) {
        throw new Error(`Could not find roomId for room ${event.location}`);
      }
    }

    // Prepare events for import in GEODE
    const formattedEvents = events.map(event => ({
      name: event.summary.val,
      type: eventType,
      authorId: organizers.filter(
        organizer => organizer.email === event.organizer.val.substring(7),
      )[0].id,
      startDate: formatDate(event.start),
      endDate: formatDate(event.end, true),
      roomId: config.locations[event.location],
    }));

    console.log(`Prepared ${formattedEvents.length} events for import.`);

    // Send all events to GEODE
    // NB: parallel requests resulted in connection timeout issues,
    // thus events are sent one after the other
    // eslint-disable-next-line
    for (const event of formattedEvents) {
      try {
        // eslint-disable-next-line
        const eventId = await book.addEvent(
          agendaClient,
          session.guid,
          event.name,
          event.type,
          event.authorId,
          event.startDate,
          event.endDate,
          event.roomId,
        );

        if (eventId === -1) {
          throw new Error(
            `room #${event.roomId} is unavailable at the desired time`,
          );
        } else {
          console.log(
            `Successfully imported event ${event.name} from ${event.startDate} to ${event.endDate} (event #${eventId})`,
          );
        }
      } catch (error) {
        console.error(
          `Could not import event ${event.name} from ${event.startDate} to ${event.endDate}: `,
          error.message,
        );
      }
    }

    // Terminate connection
    connect.endSession(session);
  } catch (error) {
    console.error(error);
  }
}

importEvents();
