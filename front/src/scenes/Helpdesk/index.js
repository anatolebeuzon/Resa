import React from "react";
import HelpVideo from "./components/HelpVideo";
// import HelpItem from "./components/HelpItem";
// import HelpData from "./HelpData";

export default () => (
  <div className="container mb-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        {" "}
        <h4>Présentation de Resa</h4>
        <HelpVideo />
      </div>
    </div>
  </div>
);

// Ready to be added:
// <h4 className="mt-5">FAQ</h4>
// <div id="accordion">
//   {HelpData.map((HelpDataItem, index) => (
//     <HelpItem
//       key={index}
//       index={index}
//       title={HelpDataItem.title}
//       content={HelpDataItem.content}
//     />
//   ))}
// </div>
// <h4 className="mt-5">Contact</h4>
// Lorem ipsum
