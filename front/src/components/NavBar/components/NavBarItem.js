import React from "react";
import { NavLink } from "react-router-dom";

export default ({ link, text }) => (
  <li className="nav-item">
    <NavLink to={link} className="nav-link" activeClassName="active">
      {text}
    </NavLink>
  </li>
);
