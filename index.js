const express = require("express");
const Expo = require("expo-server-sdk").default;
const cors = require("cors");

const expo = new Expo();
const expressServer = express();

expressServer.use(cors());
//On va le deployer sur un serveur distant donc on ne sait pas quel port il choisira donc on met process.env.PORT
//En local on se met sur le port 3000
expressServer.listen(process.env.PORT || 3000, () => {
  console.log(
    "Serveur de notifications en écoute sur le port: " + process.env.PORT ||
      3000
  );
  //Routage GET
  //url/?token=34ET5533RR par ex
  expressServer.get("/", function (req, res) {
    //On extrait le token
    const token = req.query.token;
    //On verifie si c'est un token expo valide
    if (!Expo.isExpoPushToken(token)) {
      console.log("Token invalide");
      res.send({ err: "Token invalide" });
    } else {
      //Que une notif ici pour l'exemple. Mais dans la vrai vie messages rassemble bcp de destinataires (bcp de token utilisateurs)
      //Dans la vrai vie il faudrait faire une requête sur une base de données pour avoir tous nos token et construire notre tableau
      let messages = [
        {
          to: token,
          sound: "default",
          body: "Bienvenue dans meteo-map, voici une notification envoyé depuis un serveur nodeJS distant",
          data: { test: "dataTest" },
        },
      ];
      expo
        .sendPushNotificationsAsync(messages)
        .then((ticket) => {
          res.send({ ticket: ticket });
        })
        .catch((error) => {
          console.log("Erreur d'envoi");
          res.send({ err: "Erreur d'envoi" });
        });
    }
  });
});
