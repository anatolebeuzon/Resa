import React from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faTv,
  faMapSigns,
  faBuilding,
  faUsers,
  faUserCircle,
  faChevronCircleRight
} from "@fortawesome/fontawesome-free-solid";

export default ({ resource, showBuilding }) => {
  if (
    resource.type !== "buildingAndCampus" &&
    resource.type !== "wingAndFloor" &&
    !resource.value
  ) {
    return null;
  }

  if (resource.type === "buildingAndCampus" && !showBuilding) {
    return null;
  }

  let value = "";
  let icon;

  if (resource.type === "capacity") {
    icon = faUsers;
    value = <span>{resource.value} personnes</span>;
  } else if (resource.type === "buildingAndCampus") {
    icon = faBuilding;
    // value = `Bâtiment ${resource.building} (campus de ${resource.campus})`;
    value = `Bâtiment ${resource.building}`;
  } else if (resource.type === "wingAndFloor") {
    icon = faMapSigns;

    const friendlyFloorName = {
      "-1": "sous-sol",
      "0": "rez-de-chaussée",
      "1": "1er étage",
      "2": "2e étage",
      "3": "3e étage",
      "4": "4e étage",
      "5": "5e étage"
    };

    if (resource.wing) {
      value = `Univers ${resource.wing}, ${friendlyFloorName[resource.floor]}`;
    } else {
      value = `${friendlyFloorName[resource.floor]}`;
    }
  } else if (resource.type === "video") {
    icon = faTv;
    value = "Projection vidéo";
  } else if (resource.type === "videoConference") {
    icon = faVideo;
    value = "Visioconférence";
  } else if (resource.type === "donator") {
    icon = faUserCircle;
    value = `Donateur : ${resource.value}`;
  } else if (resource.type === "roomType") {
    icon = faChevronCircleRight;
    ({ value } = resource);
  }

  return (
    <li>
      <div className="row no-gutters">
        <div className="col-12">
          <FontAwesomeIcon icon={icon} />
          &nbsp;&nbsp;{value}
        </div>
      </div>
    </li>
  );
};
