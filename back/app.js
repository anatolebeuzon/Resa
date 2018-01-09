const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const authMiddleware = require("./authMiddleware");
const search = require("./routes/search");
const book = require("./routes/book");
const login = require("./routes/login");
// const annuaire = require("./routes/annuaire");

const app = express();

/*
CORS is only required in dev as the back-end is running at
resa-dev.viarezo.fr:3001, which is different from the front-end, running at
resa-dev.viarezo.fr:80.

In production, the host is resa.centralesupelec.fr for both the front-end and the
back-end, so the user's browser won't send Origin headers, and CORS will fail
server-side, as the cors module will have 'origin' set as 'undefined'.

TL;DR: necessary in dev, useless and problematic in production
*/
if (process.env.CONFIG_ENV === "dev") {
  app.use(cors({ origin: "http://resa-dev.viarezo.fr" }));
}

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/login", login);
app.use("/api/search", authMiddleware, search);
app.use("/api/book", authMiddleware, book);
// app.use("/api/annuaire", annuaire); // dev only

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
