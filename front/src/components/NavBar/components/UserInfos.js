import React from "react";
import { Link } from "react-router-dom";

export default ({ userInfos }) => {
  let username;
  if (userInfos) {
    username = `${userInfos.firstName} ${userInfos.lastName}`;
  } else {
    username = "Chargement...";
  }

  return (
    <li className="nav-item dropdown">
      <button
        className="btn btn-link nav-link dropdown-toggle text-white custom-cursor-pointer"
        id="navbarDropdownMenuLink"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {username}
      </button>
      <div
        className="dropdown-menu dropdown-menu-right"
        aria-labelledby="navbarDropdownMenuLink"
      >
        <Link to="/logout/" className="dropdown-item">
          Déconnexion
        </Link>
      </div>
    </li>
  );
};
