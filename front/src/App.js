import React from "react";
import Raven from "react-raven";
import { Switch, Route, Redirect } from "react-router-dom";

import { Provider } from "react-redux";
import PrivateRoute from "./services/PrivateRoute";
import NavBar from "./components/NavBar";
import MyBookings from "./scenes/MyBookings";
import RoomBrowser from "./scenes/RoomBrowser";
import LoginAccept from "./scenes/LoginAccept";
import Login from "./scenes/Login";
import Logout from "./scenes/Logout";
import Helpdesk from "./scenes/Helpdesk";
import config from "./config";
import configureStore from "./configureStore";

const store = configureStore();

// Necessary to allow authenticatedFetch() to redirect to login page if it
// receives a 401 response
// eslint-disable-next-line
export let mountedRootComponent;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Load JWT token and user info from LocalStorage
    const localInfos = localStorage.getItem(`${config.localStorageName}-infos`);
    const jwtToken = localStorage.getItem(
      `${config.localStorageName}-jwtToken`
    );
    if (localInfos && jwtToken) {
      this.state = { userInfos: JSON.parse(localInfos), isAuthenticated: true };
    } else {
      this.state = {};
    }
  }

  componentDidMount() {
    mountedRootComponent = this;
  }

  showLogin() {
    localStorage.clear(); // Invalidate known token
    this.setState({ isAuthenticated: false });
  }

  render() {
    const { isAuthenticated } = this.state;

    return (
      <div className="h-100">
        <Raven dsn="" />
        <Provider store={store}>
          <Switch>
            <Route path="/login" component={Login} />
            {!isAuthenticated && (
              <Route
                path="/loginAccept/"
                component={props => (
                  <LoginAccept
                    casToken={props.location.search}
                    passUserInfos={info =>
                      this.setState({ userInfos: info, isAuthenticated: true })
                    }
                  />
                )}
              />
            )}
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              path="/logout/"
              component={Logout}
            />
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              component={() => (
                <div>
                  <NavBar userInfos={this.state.userInfos} />
                  <section>
                    <Switch>
                      <Route
                        path="/recherche/:resourceId?"
                        component={RoomBrowser}
                      />
                      <Route path="/reservations/" component={MyBookings} />
                      <Route path="/help/" component={Helpdesk} />
                      <Redirect from="/" to="/recherche/" />
                    </Switch>
                  </section>
                </div>
              )}
            />
          </Switch>
        </Provider>
      </div>
    );
  }
}
