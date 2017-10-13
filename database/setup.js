const { Pool } = require('pg');
const config = require('./config');
const db = require('./index');
const seed = require('./seedData');

const pool = new Pool(config);

const userTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL UNIQUE NOT NULL PRIMARY KEY,
    role VARCHAR(80),
    firstname VARCHAR(80),
    lastname VARCHAR(80),
    email VARCHAR(80),
    phone VARCHAR(80),
    password VARCHAR(80)
)`;

const eventsTable = `CREATE TABLE IF NOT EXISTS events (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  name VARCHAR(80),
  location VARCHAR(80),
  organizer_id SERIAL REFERENCES users(id),
  schedule_id INTEGER
)`;

const groupsTable = `CREATE TABLE IF NOT EXISTS groups (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  name VARCHAR(80),
  type VARCHAR(80),
  event_id SERIAL REFERENCES events(id),
  schedule_id INTEGER)`;

const schedulesTable = `CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  date DATE,
  event_id SERIAL REFERENCES events(id)
)`;

const activitiesTable = `CREATE TABLE IF NOT EXISTS activities (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  starttime TIME,
  endtime TIME,
  activity VARCHAR(80),
  location VARCHAR(80),
  schedule_id SERIAL REFERENCES schedules(id)
)`;

const groupActivityTable = `CREATE TABLE IF NOT EXISTS group_activity (
  group_id SERIAL NOT NULL REFERENCES groups(id),
  activity_id SERIAL NOT NULL REFERENCES activities(id),
  PRIMARY KEY (group_id, activity_id)
)`;

const groupUserTable = `CREATE TABLE IF NOT EXISTS group_user (
  group_id SERIAL NOT NULL REFERENCES groups(id),
  user_id SERIAL NOT NULL REFERENCES users(id),
  PRIMARY KEY (group_id, user_id)
)`;

const messagesTable = `CREATE TABLE IF NOT EXISTS messages (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  from_user_id SERIAL REFERENCES users(id),
  to_group_id SERIAL REFERENCES groups(id),
  title VARCHAR(80) NOT NULL,
  text VARCHAR(140),
  media VARCHAR(140),
  event_id SERIAL REFERENCES events(id),
  date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  msg_group_id INTEGER
)`;


pool.query(userTable)
  .then(() => pool.query(eventsTable))
  .then(() => pool.query(groupsTable))
  .then(() => pool.query(schedulesTable))
  .then(() => pool.query(activitiesTable))
  .then(() => pool.query(groupActivityTable))
  .then(() => pool.query(groupUserTable))
  .then(() => pool.query(messagesTable))
  .then(() => db.addUser(seed.organizer))
  .then(() => Promise.all(seed.users.map(user => db.addUser(user))))
  .then(() => Promise.all(seed.events.map(event => db.addEvent(event))))
  .then(() => Promise.all(seed.groups.map(group => db.addGroup(group))))
  .then(() => Promise.all(seed.schedules.map(schedule => db.addSchedule(schedule))))
  .then(() => Promise.all(seed.activities.map(activity => db.addActivity(activity))))
  .then(() => Promise.all(seed.groupActivity.map(groupActivity =>
    db.addGroupToActivity(groupActivity.groupId, groupActivity.activityId))))
  .then(() => Promise.all(seed.userGroups.map(userGroup =>
    db.addUserToGroup(userGroup.groupId, userGroup.userId))))
  .then(() => Promise.all(seed.messages.map(message => db.addMessage(message))))
  .then(() => {
    console.log('DB: tables created and seeded with data');
  })
  .catch(console.error);
