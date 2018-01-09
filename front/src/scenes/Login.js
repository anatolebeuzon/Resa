import React from "react";
import config from "../config";

const querystring = require("querystring");

const query = querystring.stringify({
  service: config.cas.loginService,
});

export default class Login extends React.Component {
  componentDidMount() {
    window.location.href = `${config.cas.loginUrl}?${query}`;
  }

  render() {
    return null;
  }
}
