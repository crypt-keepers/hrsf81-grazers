const express = require('express');
const db = require('../database/index');
const sendMessage = require('./twilio');


const router = express.Router();

router.use((req, res, next) => {
  console.log(`Handing ${req.originalUrl} routes`);
  next();
});

router.get('/', (req, res) => {
  db.getAllAttendees()
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((err) => {
      throw err;
    });
});

router.get('/:userId', (req, res) => {
  const userId = Number(req.params.userId);

  db.getAttendeesById(userId)
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((err) => {
      throw err;
    });
});

router.post('/', (req, res) => {
  const attendeeParams = req.body;

  db.addUser(attendeeParams)
    .then(() => {
      res.status(201).send();
      sendMessage(attendeeParams)
        .then((msgData) => {
          // console.log(msgData.sid);
        });
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = router;
