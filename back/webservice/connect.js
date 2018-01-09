const { promisify } = require("util");
const config = require("../config/index");
const soap = require("soap");

async function getClient(url) {
  return promisify(soap.createClient)(url);
}

async function getGUID(sessionClient) {
  const guid = (await promisify(sessionClient.InitSession)({
    login: config.webservice.user,
    password: config.webservice.password
  })).InitSessionResult;

  // Error handling
  switch (guid) {
    case "-1":
      throw new Error(
        "failed to create GEODE session: login or password not provided (error -1)"
      );
    case "-2":
      throw new Error(
        "failed to create GEODE session: authentication failed (error -2)"
      );
    case "-3":
      throw new Error(
        "failed to create GEODE session: an issue occurred while fetching user (error -3)"
      );
    case "-4":
      throw new Error(
        "failed to create GEODE session: user's profile does not have the rights necessary to use this WebService (error -4)"
      );
    default:
      return guid;
  }
}

async function newSession() {
  const sessionClient = await getClient(config.webservice.sessionurl);
  const guid = await getGUID(sessionClient);
  return {
    client: sessionClient,
    guid
  };
}

async function endSession(session) {
  const response = (await promisify(session.client.EndSession)({
    guid: session.guid
  })).EndSessionResult;

  // Error handling
  switch (response) {
    case -1:
      throw new Error("could not disconnect gracefully from GEODE");
    case 0:
      break;
    default:
      throw new Error("unknown error when disconnecting from GEODE");
  }
}

function getAgendaClient() {
  return getClient(config.webservice.agendaurl);
}

async function getAnnuaireClient() {
  return getClient(config.webservice.annuaireurl);
}

module.exports = {
  newSession,
  endSession,
  getAgendaClient,
  getAnnuaireClient
};
