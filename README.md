# Resa, an open-source room-booking website

Resa is a room-booking website designed with UX in mind.

It is used in production at French engineering school CentraleSupélec and enables thousands of students, teachers, researchers and staff members to check room availability and book rooms online. Our hope is that it provides an intuitive and natural booking experience.

[Watch the 1-minute demo >>](https://vimeo.com/250163250)

## General structure

It consists of two parts:

* a front-end, namely a single-page JavaScript application written in React
* a back-end, written in Node.js

The back-end is stateless: it communicates with GEODE, a (proprietary) campus management system designed by [Alcuin](http://www.alcuin.com/). If your organization does not use GEODE, Resa will not work out of the box, but you may use the front-end and rewrite the back-end to fit your needs.

## Features

Key features:

* book a room in less than a minute
* receive by email a booking confirmation with an ICS event for your calendar
* easily modify or cancel your booking online
* mobile-friendly interface

Advanced features:

* filter rooms by type or capacity
* use fuzzy search to find a particular room
* see all the events planned for a room on a particular day
* use direct link to book a particular room: `resa.example.com/recherche/{roomId}` (especially useful if you put QR codes outside of rooms that can be booked)

## Built with

* [React](https://reactjs.org/), a JavaScript library for building user interfaces
* [Redux](https://redux.js.org/), a predictable state container for JavaScript apps
* [Bootstrap 4](https://getbootstrap.com), a front-end component library
* [Node.js](https://nodejs.org/en/), a JavaScript runtime for the back-end

As well as many other projects you can find in `front/package.json` and `back/package.json`.

## Getting started

### Front-end

#### Prerequisites

You will need Git and NPM, as well as a CAS server for authentication.

#### Installing

```
git clone INSERT URL HERE
cd front
npm install
```

#### Configuring

Before going further, we need to configure the front-end. Create a `front/src/config.js` file with the following content:

```
const config = {
  cas: {
    loginUrl: "https://cas.example.com/login",
    logoutUrl: "https://cas.example.com/logout",
    loginService: "https://resa.example.com/loginAccept/", // URL where the user is redirected to after login
    logoutService: "https://resa.example.com/", // URL where the user is redirected to after logout
  },
  back: {
    url: "https://resa.example.com/api", // URL of your back-end server
  },
  imagesBaseURL: "https://resa.example.com/static",
  localStorageName: "resa.example.com",
};

export default config;
```

Notes:

* by default, authentication uses Central Authentication Service (CAS). You may need to authorize Resa's URLs on your CAS server for authentication to work
* a static asset server can be used to serve images of rooms. The image for room with id `resourceId` will be fetched from `${config.imagesBaseURL}${resourceId}` ; if a 404 is received, there will be a silent error and no image nor any error will be displayed. Leave `config.imagesBaseURL` blank is you do not want to use this feature
* LocalStorage is used to store the user's full name and the JWT token that authenticates his back-end requests

#### Launching

By default, the front-end listens on port 80 so you will need `sudo` to assign that port:

```
sudo npm start
```

### Back-end

#### Prerequisites

You will need Git, NPM, Node 8+, and a GEODE server.

#### Installing

```
git clone INSERT URL HERE
cd back
npm install
```

#### Configuring

Create a `back/config/secrets.json` file with the following content:

```
{
    "webservicePassword": "INSERT_PASSWORD_FOR_GEODE_API_ACCOUNT",
    "jwtSecret": "INSERT_LONG_RANDOM_STRING",
    "smtpPassword": "INSERT_PASSWORD_FOR_SMTP_ACCOUNT"
}
```

And a `back/config/index.js` file with the following:

```
const secrets = require("./secrets");

module.exports = {
  webservice: {
    sessionurl:
      "https://geode.example.com/opdotnet/webservices/session.asmx?wsdl",
    agendaurl:
      "https://geode.example.com/opdotnet/webservices/public/agenda.asmx?wsdl",
    annuaireurl:
      "https://geode.example.com/opdotnet/webservices/public/annuaire.asmx?wsdl",
    user: "INSERT_USERNAME_FOR_GEODE_API_ACCOUNT",
    password: secrets.webservicePassword,
  },
  cas: {
    loginUrl: "https://cas.example.com/login",
    rscUrl: "https://cas.example.com/p3/serviceValidate", // URL for CAS ticket validation service
    service: "https://resa.example.com/loginAccept/", // URL where the user is redirected to after login
  },
  jwt: {
    secret: secrets.jwtSecret,
  },
  smtp: {
    host: "smtp.example.com",
    port: "465",
    secure: "true",
    auth: {
      user: "INSERT_USERNAME_FOR_SMTP_ACCOUNT",
      pass: secrets.smtpPassword,
    },
  },
  devGeodeUserId: "", // Optional: insert GEODE account id for development
  adminEmail: "INSERT_NOTIFICATION_EMAIL", // May receive notifications about accounts with missing emails in GEODE
  server: {},
  public: {},
};
```

Finally, create a file at `back/webservice/translatorConfig.js` that tells our back-end how to translate the data received from the GEODE's SOAP API. This is pretty long and the numbers will depend on your GEODE configuration. For example, ours looks like this:

```
{
  "room": {
    "resourceType": {
      "id": "1",
      "code": "SAL"
    },
    "treeLocation": {
      "92": "Saclay",
      "94": "Metz",
      "107": "Rennes"
    },
    "campus": {
      "CodPro": "SIT",
      "ValPro": {
        "73": "Saclay",
        "75": "Metz",
        "74": "Rennes"
      },
      "requiredForImport": "true"
    },
    "building": {
      "CodPro": "121",
      "ValPro": {
        "122": "Gustave Eiffel",
        "123": "Francis Bouygues",
        "124": "Louis-Charles Breguet"
      },
      "requiredForImport": "true"
    },
    "wing": {
      "CodPro": "122",
      "ValPro": {
        "125": "Vivant",
        "126": "Énergie",
        "127": "Matière",
        "128": "Langues",
        "129": "entreprise",
        "130": "simulation",
        "131": "homme & monde",
        "132": "A",
        "133": "B",
        "134": "C",
        "135": "D",
        "136": "E",
        "137": "F"
      },
      "requiredForImport": "true"
    },
    "floor": {
      "CodPro": "123",
      "ValPro": {
        "138": "-1",
        "139": "0",
        "140": "1",
        "141": "2",
        "142": "3",
        "143": "4",
        "144": "5"
      },
      "requiredForImport": "true"
    },
    "capacity": {
      "CodPro": "CAP",
      "ValPro": "getValueDirectly",
      "valueType": "integer",
      "requiredForImport": "false"
    },
    "type": {
      "CodPro": "45",
      "ValPro": {
        "102": "Salle tutorial",
        "27": "Amphithéâtre",
        "28": "Auditorium",
        "100": "Salle d'enseignement",
        "61": "Salle de musique",
        "101": "Salon de réception",
        "31": "Salle de réunion",
        "70": "Salle de sport",
        "103": "Espace projet",
        "121": "Studio d'enregistrement"
      },
      "requiredForImport": "true"
    },
    "videoRecording": {
      "CodPro": "112",
      "ValPro": {
        "109": "true",
        "110": "false"
      },
      "valueType": "boolean",
      "requiredForImport": "false"
    },
    "imageURL": {
      "CodPro": "110",
      "ValPro": "getValueDirectly",
      "valueType": "string",
      "requiredForImport": "false"
    },
    "video": {
      "CodPro": "113",
      "ValPro": {
        "111": "true",
        "112": "false"
      },
      "valueType": "boolean",
      "requiredForImport": "false"
    },
    "videoConference": {
      "CodPro": "111",
      "ValPro": {
        "107": "true",
        "108": "false"
      },
      "valueType": "boolean",
      "requiredForImport": "false"
    },
    "audioConference": {
      "CodPro": "115",
      "ValPro": {
        "119": "true",
        "120": "false"
      },
      "valueType": "boolean",
      "requiredForImport": "false"
    },
    "audio": {
      "CodPro": "116",
      "ValPro": {
        "117": "true",
        "118": "false"
      },
      "valueType": "boolean",
      "requiredForImport": "false"
    },
    "liveStreaming": {
      "CodPro": "117",
      "ValPro": {
        "115": "true",
        "116": "false"
      },
      "valueType": "boolean",
      "requiredForImport": "false"
    },
    "roomDelegate": {
      "CodPro": "114",
      "ValPro": "getValueDirectly",
      "valueType": "string",
      "requiredForImport": "false"
    },
    "allowBookings": {
      "CodPro": "118",
      "ValPro": {
        "113": "true",
        "114": "false"
      },
      "valueType": "boolean",
      "requiredForImport": "true"
    },
    "donator": {
      "CodPro": "119",
      "ValPro": "getValueDirectly",
      "valueType": "string",
      "requiredForImport": "false"
    }
  },
  "event": {
    "type": {
      "RDV": "rendez-vous",
      "MEM": "mémo",
      "MAL": "maladie",
      "ABS": "absence",
      "215": "réunion",
      "63": "activité annexe",
      "64": "formation",
      "65": "maintenance",
      "66": "préparation",
      "217": "concours / admission"
    },
    "resource": {
      "CodPro": "RES"
    },
    "author": {
      "CodPro": "AUT"
    },
    "startTime": {
      "CodPro": "DEB"
    },
    "endTime": {
      "CodPro": "FIN"
    },
    "date": {
      "CodPro": "DAT"
    },
    "active": "ACT"
  }
}
```

### Launching

```
npm start
```

## Authors

**Lead developer:** Anatole Beuzon

**Project manager:** Michel Guennoc

**Contributors and reviewers:** Ronan Pelliard and Sami Tabet

## License

This project is open-source under the [GNU GPLv3 license](https://www.gnu.org/licenses/gpl-3.0.en.html).
