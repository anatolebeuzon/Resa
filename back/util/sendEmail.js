const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const juice = require("juice");
const fs = require("fs");
const moment = require("moment");
const request = require("request-promise-native");
require("moment/locale/fr");
const search = require("../webservice/search");
const eventCreator = require("./eventCreator");
const smtpConfig = require("../config").smtp;
const config = require("../config");

/* eslint-disable */
require.extensions[".html"] = function(module, filename) {
  module.exports = fs.readFileSync(filename, "utf8");
};
/* eslint-enable */

const source = require("./emailSource.html");

const template = Handlebars.compile(juice(source), { noEscape: true });
const sender = '"Resa CentraleSupélec" <noreply@centralesupelec.fr>';

function send(
  destinationAddress,
  subject,
  plaintextBody,
  htmlBody,
  attachments,
) {
  // Set SMTP parameters
  const transporter = nodemailer.createTransport(smtpConfig);

  // Setup e-mail data
  const mailOptions = {
    from: sender, // sender address
    to: destinationAddress, // list of receivers
    subject, // Subject line
    text: plaintextBody, // plain text body
    html: htmlBody, // html body
    attachments,
  };

  // send e-mail with defined transport object
  // eslint-disable-next-line
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(error);
    }
    console.log(`Email sent to ${destinationAddress}`);
  });
}

async function doesRoomImageExists(roomId) {
  /*
  Returns true if image URL gets a 2xx response code
  Else returns false (in particular, return false if image URL gets a 404)
  */
  try {
    await request(`https://resa.centralesupelec.fr/roomImages/${roomId}.jpg`);
    return true;
  } catch (error) {
    return false;
  }
}

async function confirmBooking(
  agendaClient,
  guid,
  eventId,
  eventName,
  startDate,
  endDate,
  roomId,
  user,
  isModification,
  // if isModification === true, it means the booking already existed
  // and is simply being modified
) {
  try {
    // Get room info
    const room = await search.getRoomDetail(agendaClient, guid, roomId);

    // Generate .ics event file for Outlook, iCalendar, etc.
    const friendlyFloorName = {
      "-1": "Sous-sol",
      "0": "Rez-de-chaussée",
      "1": "1er étage",
      "2": "2e étage",
      "3": "3e étage",
      "4": "4e étage",
      "5": "5e étage",
    };

    const ics = await eventCreator.createEvent(
      eventId,
      eventName,
      startDate,
      endDate,
      room.name,
      room.building,
      room.wing,
      friendlyFloorName[room.floor],
      user,
    );

    const attachments = [
      {
        // utf-8 string as an attachment
        filename: `Réservation ${room.name}.ics`,
        content: ics,
      },
    ];

    const subject = isModification
      ? `Modification de votre réservation : ${eventName}`
      : `Confirmation de votre réservation : ${eventName}`;

    const openingStatement = isModification
      ? `Votre réservation de la salle ${room.name} a bien été modifiée`
      : `Votre réservation de la salle ${room.name} est confirmée`;

    // Format e-mail content
    const data = {
      previewText: `${openingStatement}.`,
      textBeforeButton: `
<h4>${openingStatement} :</h4>
<center>
<b>${eventName}</b><br>
${moment(startDate)
        .utc()
        .format("dddd D MMMM")}<br>
de ${moment(startDate)
        .utc()
        .format("H[h]mm")} à ${moment(endDate)
        .utc()
        .format("H[h]mm")}<br>
Réservée par ${user.firstName} ${user.lastName}
</center>
<br>
<h4>Pour vous rendre à cette salle :</h4>
<center>
Salle ${room.name}<br>
Bâtiment ${room.building}<br>
Univers ${room.wing}<br>
${friendlyFloorName[room.floor]}
</center>
  `,
      buttonText: "Modifier ou annuler cette réservation",
      link: "https://resa.centralesupelec.fr/reservations",
      textAfterButton: `
Vous pouvez ajouter simplement cette réservation à votre calendrier en ouvrant l'évènement en pièce-jointe.
`,
      imageExists: await doesRoomImageExists(room.id),
      roomId: room.id,
    };

    const htmlBody = template(data);

    const plaintextBody = `
  ${openingStatement} :

  ${eventName}
  ${moment(startDate)
    .utc()
    .format("dddd D MMMM")}
  ${moment(startDate)
    .utc()
    .format("H[h]mm")} > ${moment(endDate)
      .utc()
      .format("H[h]mm")}
  Réservée par ${user.firstName} ${user.lastName}

  Pour vous rendre à cette salle :
  Salle ${room.name}
  Bâtiment ${room.building}
  Univers ${room.wing}
  ${friendlyFloorName[room.floor]}

  À tout moment, vous pouvez modifier ou annuler cette réservation sur resa.centralesupelec.fr.

  Vous pouvez ajouter simplement cette réservation à votre calendrier en ouvrant l'évènement en pièce-jointe.
  `;

    send(user.email, subject, plaintextBody, htmlBody, attachments);
  } catch (error) {
    console.error(error);
  }
}

async function notifyAdminsOfMissingEmail(user) {
  const { adminEmail } = config;
  const subject = `[Resa] Email manquant dans GEODE : ${user.email}`;
  const plaintextBody = `
L'utilisateur suivant a essayé, sans succès, de réserver une salle en utilisant le site Resa.
En effet, l'utilisateur n'a pas été trouvé dans GEODE. La cause la plus fréquente est que l'email de l'utilisateur sur GEODE est différente de l'email qu'il utilise pour le CAS.

Vous pouvez régler ce problème en remplaçant son email GEODE par son email CAS.

Détails de l'utilisateur :
- Nom complet : ${user.firstName} ${user.lastName}
- Email CAS : ${user.email}

*** Email envoyé automatiquement par Resa (resa.centralesupelec.fr) ***
`;

  send(adminEmail, subject, plaintextBody);
}

module.exports = { confirmBooking, notifyAdminsOfMissingEmail };
