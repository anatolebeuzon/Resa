import React from "react";
import Raven from "raven-js";
import jwtDecode from "jwt-decode";
import { string, func } from "prop-types";

import LoadSpinner from "../components/LoadSpinner";
import config from "../config";

const querystring = require("querystring");

export default class LoginAccept extends React.Component {
  state = {
    loading: true
  };

  static propTypes = {
    casToken: string.isRequired,
    passUserInfos: func.isRequired
  };

  render() {
    if (this.state.loading) {
      return (
        <div className="container d-flex h-100 align-items-center justify-content-center">
          <div className="text-center pt-3 pb-3">
            <LoadSpinner />
          </div>
        </div>
      );
    }

    return (
      <div className="container d-flex h-100 align-items-center justify-content-center">
        <div className="text-center pt-3 pb-3">
          <h4 className="mb-4">
            Une erreur s'est produite lors de l'authentification.
          </h4>
          <a href="../login" className="btn btn-primary">
            Réessayer
          </a>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    const { casToken, passUserInfos } = this.props;

    const casTicket = querystring.parse(casToken.substring(1)).ticket;

    if (casTicket !== undefined) {
      try {
        // Validate the CAS-provided ticket with the back-end
        const response = await fetch(`${config.back.url}/login/${casTicket}`);
        if (!response.ok) throw Error(response.statusText);

        // Clear localStorage (useful in case of issues with older versions of Resa)
        localStorage.clear();

        // Store the jwtToken for future requests to the back-end
        const jwtToken = await response.json();
        localStorage.setItem(`${config.localStorageName}-jwtToken`, jwtToken);

        // Store user info for later use
        const infos = jwtDecode(jwtToken);
        localStorage.setItem(
          `${config.localStorageName}-infos`,
          JSON.stringify(infos)
        );
        passUserInfos(infos);
      } catch (error) {
        this.setState({ loading: false });
        Raven.captureException(error);
      }
    }
  }
}
