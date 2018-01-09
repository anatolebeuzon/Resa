const { promisify } = require("util");
const express = require("express");
const config = require("../config/");
const request = require("request");
const querystring = require("querystring");
const xml2js = require("xml2js");
const jwt = require("jsonwebtoken");

const asyncRequest = promisify(request);
const asyncParse = promisify(xml2js.parseString);
const router = express.Router();

router.get("/:token", async (req, res) => {
  // Prepare for request to CAS
  const query = querystring.stringify({
    service: config.cas.service,
    ticket: req.params.token
  });

  try {
    // Ask CAS if the token sent by the front is valid
    const cas = await asyncRequest(`${config.cas.rscUrl}?${query}`);
    const result = await asyncParse(cas.body.replace(/cas:/g, ""));

    // Handle errors
    if (!result.serviceResponse) {
      throw new Error("CAS Response is not a correct XML");
    } else if (!result.serviceResponse.authenticationSuccess) {
      throw new Error("Authentication failed");
    }

    // Build userInfo for later use
    const userObj = result.serviceResponse.authenticationSuccess[0];
    let userInfo;
    if (userObj.attributes[0].givenname !== undefined) {
      userInfo = {
        firstName: userObj.attributes[0].givenname[0],
        lastName: userObj.attributes[0].surname[0],
        email: userObj.user[0],
      };
    } else {
      const fullName = userObj.attributes[0].simpleName[0].split(" ");
      userInfo = {
        firstName: fullName[0],
        lastName: fullName.slice(1).join(" "),
        email: userObj.attributes[0].email[0]
      };
    }

    // Create JWT token
    const jwtToken = await promisify(jwt.sign)(userInfo, config.jwt.secret)

    // Validate login
    res.status(200).json(jwtToken);

  } catch(error) {
    console.error(error);
    res.sendStatus(401);
  }
});

module.exports = router;
