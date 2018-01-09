const express = require("express");
const connect = require("../webservice/connect");
const book = require("../webservice/book");

const router = express.Router();

router.get("/all/", async (req, res) => {
  // For dev purposes only

  try {
    const [session, annuaireClient] = await Promise.all([
      connect.newSession(),
      connect.getAnnuaireClient(),
    ]);

    const response = await book.getPersonList(annuaireClient, session.guid);

    res.status(200).json({ response });

    connect.endSession(session);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
