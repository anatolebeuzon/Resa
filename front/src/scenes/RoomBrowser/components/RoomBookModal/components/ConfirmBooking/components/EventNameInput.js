import React from "react";

export default class EventNameInput extends React.PureComponent {
  componentDidMount() {
    // Focus on the text input
    // TODO: handle this in a cleaner way (the following is a hack)
    if (this.props.available) {
      setTimeout(() => {
        this._input.focus();
      }, 500);
    }
  }

  render() {
    if (this.props.available) {
      return (
        <div className="row align-items-center justify-content-center no-gutters">
          <div className="col-lg-3">Titre de l'évènement :</div>
          <div className="col-lg-9">
            <div
              className={
                this.props.attemptedConfirm
                  ? "form-group mb-0 was-validated"
                  : "form-group mb-0"
              }
            >
              <input
                ref={input => {
                  this._input = input;
                }}
                type="text"
                className={
                  this.props.eventName
                    ? "form-control valid"
                    : "form-control invalid"
                }
                id="eventName"
                value={this.props.eventName}
                onChange={this.props.handleEventNameInputChange}
                onKeyPress={this.props.detectEnter}
                required
              />
              <div className="invalid-feedback">
                Veuillez indiquer l'objet de l'évènement
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="alert alert-secondary" role="alert">
        Cette salle n'est pas disponible au créneau demandé. Vous pouvez :<br />
        -{" "}
        <a className="alert-secondary" href="/">
          choisir un autre créneau
        </a>
        <br />
        - contacter la personne ayant réservé la salle au créneau souhaité, en
        cliquant sur son nom ci-dessus
      </div>
    );
  }
}
