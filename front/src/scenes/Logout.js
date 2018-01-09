import React from "react";
import querystring from "querystring";

import config from "../config";

export default class Logout extends React.Component {
  componentDidMount() {
    // Remove infos and jwtToken from local storage
    localStorage.removeItem(`${config.localStorageName}-infos`);
    localStorage.removeItem(`${config.localStorageName}-jwtToken`);

    // Logout from CAS
    const query = querystring.stringify({
      service: config.cas.logoutService,
    });
    window.location.href = `${config.cas.logoutUrl}?${query}`;
  }

  render() {
    return null;
  }
}
