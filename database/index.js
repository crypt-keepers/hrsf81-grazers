const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config);

const addUser = user =>
  pool.query(
    'INSERT INTO users(role, firstname, lastname, email, phone, password) values($1, $2, $3, $4, $5, $6) RETURNING id',
    [user.role, user.firstname, user.lastname, user.email, user.phone, user.password]
  );

const addEvent = event =>
  pool.query(
    'INSERT INTO events(name, location, organizer_id, schedule_id) values($1, $2, $3, $4)',
    [event.name, event.location, event.organizerId, event.scheduleId]
  );

const addSchedule = schedule =>
  pool.query(
    'INSERT INTO schedules(date, event_id) values($1, $2)',
    [schedule.date, schedule.eventId]
  );

const addActivity = activity =>
  pool.query(
    'INSERT INTO activities(starttime, endtime, activity, location, schedule_id) values($1, $2, $3, $4, $5)',
    [activity.starttime, activity.endtime, activity.activity, activity.location, activity.scheduleId]
  );

const addGroupToActivity = (groupId, activityId) =>
  pool.query(
    'INSERT INTO group_activity(group_id, activity_id) values($1, $2)',
    [groupId, activityId]
  );

const addGroup = group =>
  pool.query(
    'INSERT INTO groups(name, type, event_id, schedule_id) values($1, $2, $3, $4)',
    [group.name, group.type, group.eventId, group.scheduleId]
  );

const findGroup = group =>
  pool.query(`SELECT id FROM groups WHERE LOWER(name)=LOWER('${group}')`);

const findGroupById = groupId =>
  pool.query(`SELECT * FROM groups WHERE id='${groupId}'`);

const findGroupByUserId = userId =>
  pool.query(`SELECT * FROM group_user WHERE user_id='${userId}'`);


const addUserToGroup = (groupId, userId) =>
  pool.query(
    'INSERT INTO group_user(group_id, user_id) values($1, $2)',
    [groupId, userId]
  );

const addMessage = (message) => {
  const messageInserts = message.toIds.map(recipientId =>
    pool.query(
      'INSERT INTO messages(from_user_id, to_group_id, title, text, media, event_id, date_time, msg_group_id) values($1, $2, $3, $4, $5, $6, $7, $8)',
      [message.fromId, recipientId, message.title, message.text, message.media, message.eventId, message.timestamp, message.msgGroupId]
    ));

  return Promise.all(messageInserts);
};

const getAllUsers = () =>
  pool.query('SELECT * FROM users');

const getOneUser = (firstname, lastname) =>
  pool.query(`SELECT * FROM users WHERE firstname='${firstname}' AND lastname='${lastname}'`);

const findOneEmail = email =>
  pool.query(`SELECT * FROM users WHERE email='${email}'`);

const findUserById = id =>
  pool.query(`SELECT * FROM users WHERE id='${id}'`);

const getAllEvents = () =>
  pool.query('SELECT * FROM events');

const getAllSchedules = () =>
  pool.query('SELECT * FROM schedules');

const getAllActivities = () =>
  pool.query('SELECT * FROM activities');

const getAllGroups = () =>
  pool.query('SELECT * FROM groups');

const getAllMessages = () =>
  pool.query('SELECT * FROM messages');

const getMessages = (fromId, toId) =>
  pool.query(`SELECT firstname, lastname, string_agg(name,'|') AS togroups, title, text, date_time
     FROM messages
     JOIN users ON messages.from_user_id = users.id
     ${fromId ? `AND messages.from_user_id = ${fromId}` : ''}
     JOIN groups ON messages.to_group_id = groups.id AND messages.event_id = groups.event_id
     ${toId ? `AND messages.to_group_id = ${toId}` : ''}
     GROUP BY msg_group_id, title, text, firstname, lastname, from_user_id, date_time
     ORDER BY date_time`);

const getUsersByGroup = groupId =>
  pool.query(`SELECT users.*
    FROM users
    INNER JOIN group_user
    ON users.id = group_user.user_id
    INNER JOIN groups
    ON group_user.group_id = groups.id
    WHERE group_user.group_id = ${groupId}
    ORDER by lastname`);

const getGroupByUser = userId =>
  pool.query(`SELECT groups.*
    FROM groups
    INNER JOIN group_user
    ON groups.id = group_user.group_id
    INNER JOIN users
    ON group_user.user_id = users.id
    WHERE group_user.user_id = ${userId}`);

const getGroupsByEvent = eventId =>
  pool.query(`SELECT *
    FROM groups
    WHERE groups.event_id = ${eventId}
    ORDER by name`);

const getEvent = eventId =>
  pool.query(`SELECT *
    FROM events
    WHERE events.id = ${eventId}`);

const getSchedulesByEvent = eventId =>
  pool.query(`SELECT *
    FROM schedules
    WHERE schedules.event_id = ${eventId}
    ORDER by date`);

const getActivitiesByDay = scheduleId =>
  pool.query(`SELECT *
    FROM activities
    WHERE activities.schedule_id = ${scheduleId}
    ORDER by starttime`);

const getActivitiesByDayByGroup = (scheduleId, groupId) =>
  pool.query(`(SELECT activities.*
    FROM activities
    WHERE activities.schedule_id = ${scheduleId})
    INTERSECT
    (SELECT activities.*
    FROM activities
    INNER JOIN group_activity
    ON activities.id = group_activity.activity_id
    INNER JOIN groups
    ON group_activity.group_id = groups.id
    WHERE group_activity.group_id = ${groupId})
    ORDER by starttime`);

const getGroupNamesByActivity = activityId =>
  pool.query(`SELECT groups.*
    FROM groups
    INNER JOIN group_activity
    ON groups.id = group_activity.group_id
    INNER JOIN activities
    ON group_activity.activity_id = activities.id
    WHERE group_activity.activity_id = ${activityId}
    ORDER by name`);

const getAllAttendees = () =>
  pool.query("SELECT * FROM users where role = 'attendee'");

const getAttendeesById = userId =>
  pool.query(`SELECT * FROM users where role = 'attendee' and id = ${userId}`);


module.exports = {
  addUser,
  addEvent,
  addSchedule,
  addActivity,
  addGroupToActivity,
  addGroup,
  addUserToGroup,
  addMessage,
  getAllUsers,
  getOneUser,
  getAllEvents,
  getAllSchedules,
  getAllActivities,
  getAllGroups,
  getAllMessages,
  getMessages,
  getUsersByGroup,
  getGroupsByEvent,
  findUserById,
  findOneEmail,
  findGroup,
  findGroupById,
  findGroupByUserId,
  getGroupByUser,
  getEvent,
  getSchedulesByEvent,
  getActivitiesByDay,
  getActivitiesByDayByGroup,
  getGroupNamesByActivity,
  getAllAttendees,
  getAttendeesById,
};
