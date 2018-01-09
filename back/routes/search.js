const express = require("express");
const connect = require("../webservice/connect");
const search = require("../webservice/search");

const router = express.Router();

/*
To search available rooms, a client can go to /api/search/
A JSON object is returned with the attributes specified in the return statement
of parseRoom(room) (in webservice/roomParser.js)
*/

router.get("/available/:startDate/:endDate/", async (req, res) => {
  try {
    const [session, agendaClient, annuaireClient] = await Promise.all([
      connect.newSession(),
      connect.getAgendaClient(),
      connect.getAnnuaireClient()
    ]);

    const rooms = await search.getAvailableRooms(
      agendaClient,
      annuaireClient,
      session.guid,
      req.params.startDate,
      req.params.endDate
    );
    res.status(200).json(rooms);

    connect.endSession(session);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/roomDetail/:roomId/:selectedDate/", async (req, res) => {
  try {
    const [session, agendaClient, annuaireClient] = await Promise.all([
      connect.newSession(),
      connect.getAgendaClient(),
      connect.getAnnuaireClient()
    ]);

    const room = await search.getRoomDetailWithEvents(
      agendaClient,
      annuaireClient,
      session.guid,
      Number(req.params.roomId),
      req.params.selectedDate
    );
    res.status(200).json(room);
    connect.endSession(session);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/roomAgenda/:roomId/:startDate/:endDate/", async (req, res) => {
  try {
    const [session, agendaClient, annuaireClient] = await Promise.all([
      connect.newSession(),
      connect.getAgendaClient(),
      connect.getAnnuaireClient()
    ]);

    const room = (await search.getAvailableRooms(
      agendaClient,
      annuaireClient,
      session.guid,
      req.params.startDate,
      req.params.endDate,
      req.params.roomId
    ))[0].content[0];
    res.status(200).json(room);

    connect.endSession(session);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
