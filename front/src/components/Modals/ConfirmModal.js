import React from "react";
import Modal from "./components/Modal";

export default ({
  title,
  body,
  confirmButtonText,
  confirmButtonFunction,
  showConfirmButton = true,
  cancelActionText,
}) => {
  // see "Modal.js" for details on what clearFunction is

  const footer = [
    <button
      type="button"
      className="btn btn-secondary"
      data-dismiss="modal"
      key="cancelAction"
    >
      {cancelActionText}
    </button>,
  ];

  if (showConfirmButton) {
    footer.push(
      <button
        type="button"
        className="btn btn-success custom-btn-cs"
        onClick={confirmButtonFunction}
        key="confirmAction"
      >
        {confirmButtonText}
      </button>,
    );
  }

  return <Modal title={title} body={body} footer={footer} />;
};
