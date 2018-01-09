const Joi = require("joi");

function input(schema, data) {
  const { error } = Joi.validate(data, schema);
  if (error) throw new Error(error);
}

const template = {
  text: Joi.string().required(),
  date: Joi.string()
    .isoDate()
    .required(),
  number: Joi.number()
    .integer()
    .positive()
    .required(),
};

const schema = {
  addEvent: {
    eventName: template.text,
    startDate: template.date,
    endDate: template.date,
    roomId: template.number,
  },
  modifyEvent: {
    eventId: template.number,
    newEventName: template.text,
    newStartDate: template.date,
    newEndDate: template.date,
    newRoomId: template.number,
  },
  cancelEvent: {
    eventId: template.number,
  },
};

module.exports = { input, schema };
