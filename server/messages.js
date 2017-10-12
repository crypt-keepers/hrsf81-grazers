const express = require('express');
const db = require('../database/index');
const aws = require('./helpers/aws');
const router = express.Router();

router.use((req, res, next) => {
  console.log('Handling /messages routes');
  next();
});

router.get('/', (req, res) => {
  db.getAllMessages()
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch(console.error);
});

router.get('/display', (req, res) => {
  db.getMessages()
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch(console.error);
});

router.get('/display/from/:fromUserId', (req, res) => {
  const fromId = Number(req.params.fromUserId);
  db.getMessages(fromId, null)
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch(console.error);
});

router.get('/display/to/:toGroupId', (req, res) => {
  const toId = Number(req.params.toGroupId);
  db.getMessages(null, toId)
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch(console.error);
});

module.exports = router;
