const express = require("express");

const connect = require("../webservice/connect");
const book = require("../webservice/book");
const validate = require("../util/validate");
const sendEmail = require("../util/sendEmail");

const router = express.Router();

router.post("/add/", async (req, res) => {
  /*
  Required POST parameters:
  - eventName
  - startDate
  - endDate
  - roomId

  /!\ startDate and endDate must be in ISO 8601 string format.
  */

  try {
    // Sanity check of inputs
    validate.input(validate.schema.addEvent, req.body);

    // Connect to GEODE
    const [session, agendaClient, annuaireClient] = await Promise.all([
      connect.newSession(),
      connect.getAgendaClient(),
      connect.getAnnuaireClient(),
    ]);

    // Fetch GEODE userId using firstName and lastName given by CAS
    const authorId = await book.getPersonIdFromEmail(
      annuaireClient,
      session.guid,
      req.user.email,
    );

    if (authorId === -1) {
      // could not find any user with this email in GEODE
      // Notify administrators
      sendEmail.notifyAdminsOfMissingEmail(req.user);
      res.status(200).json({
        failedBecauseAlreadyBooked: false,
        failedBecauseMissingEmail: true,
      });
    } else {
      // user was found, continue the booking process

      const eventId = await book.addEvent(
        agendaClient,
        session.guid,
        req.body.eventName,
        authorId,
        req.body.startDate,
        req.body.endDate,
        req.body.roomId,
      );

      if (eventId === -1) {
        // room was unavailable
        res.status(200).json({
          failedBecauseAlreadyBooked: true,
          failedBecauseMissingEmail: false,
        });
      } else {
        // booking succeeded
        res.status(200).json({
          failedBecauseAlreadyBooked: false,
          failedBecauseMissingEmail: false,
        });

        await sendEmail.confirmBooking(
          agendaClient,
          session.guid,
          eventId,
          req.body.eventName,
          req.body.startDate,
          req.body.endDate,
          req.body.roomId,
          req.user,
          false,
        );
      }
    }

    connect.endSession(session);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/cancel/", async (req, res) => {
  /*
  Required POST parameters:
  - eventId
  */

  try {
    // Sanity check of inputs
    validate.input(validate.schema.cancelEvent, req.body);

    // Connect to GEODE
    const [session, agendaClient, annuaireClient] = await Promise.all([
      connect.newSession(),
      connect.getAgendaClient(),
      connect.getAnnuaireClient(),
    ]);

    // Fetch GEODE userId using email given by CAS
    const authorId = await book.getPersonIdFromEmail(
      annuaireClient,
      session.guid,
      req.user.email,
    );

    // Ensure that the user has the right to cancel this booking
    await book.ensureEventBelongsToUser(
      agendaClient,
      session.guid,
      authorId,
      req.body.eventId,
    );

    await book.cancelEvent(agendaClient, session.guid, req.body.eventId);

    res.sendStatus(200);

    connect.endSession(session);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.post("/modify/", async (req, res) => {
  /*
  Required POST parameters:
  - eventId
  - newEventName
  - newStartDate
  - newEndDate
  */

  try {
    // Sanity check of inputs
    validate.input(validate.schema.modifyEvent, req.body);

    // Connect to GEODE
    const [session, agendaClient, annuaireClient] = await Promise.all([
      connect.newSession(),
      connect.getAgendaClient(),
      connect.getAnnuaireClient(),
    ]);

    // Fetch GEODE userId using email given by CAS
    const authorId = await book.getPersonIdFromEmail(
      annuaireClient,
      session.guid,
      req.user.email,
    );

    // Ensure that the user has the right to modify this booking
    await book.ensureEventBelongsToUser(
      agendaClient,
      session.guid,
      authorId,
      req.body.eventId,
    );

    // if success === true then modification succeeded
    // if success === false then room was unavailable at the specified time
    const success = await book.modifyEvent(
      agendaClient,
      session.guid,
      req.body.eventId,
      req.body.newEventName,
      authorId,
      req.body.newStartDate,
      req.body.newEndDate,
      req.body.newRoomId,
    );

    res.status(200).json({ success });

    if (success) {
      await sendEmail.confirmBooking(
        agendaClient,
        session.guid,
        req.body.eventId,
        req.body.newEventName,
        req.body.newStartDate,
        req.body.newEndDate,
        req.body.newRoomId,
        req.user,
        true,
      );
    }

    connect.endSession(session);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/list/", async (req, res) => {
  try {
    const [session, agendaClient, annuaireClient] = await Promise.all([
      connect.newSession(),
      connect.getAgendaClient(),
      connect.getAnnuaireClient(),
    ]);

    // Fetch GEODE userId using email given by CAS
    const personId = await book.getPersonIdFromEmail(
      annuaireClient,
      session.guid,
      req.user.email,
    );

    // Fetch and format this person's events
    const eventList = await book.getStapledPersonEventList(
      agendaClient,
      annuaireClient,
      session.guid,
      personId,
    );

    res.status(200).json({ eventList });

    connect.endSession(session);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
