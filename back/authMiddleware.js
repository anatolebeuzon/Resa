const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const config = require("./config/");

const authMiddleware = async (req, res, next) => {
  try {
    const { jwtToken } = req.query;
    // Verify token and store decoded content for future use
    req.user = await promisify(jwt.verify)(jwtToken, config.jwt.secret);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send("You must be authenticated in order to hit /api");
  }
};

module.exports = authMiddleware;
