const express = require('express');
const db = require('../database/index');

const router = express.Router();

router.route('/')
  .get((req, res) => {
    res.status(200).send();
  })
  .post((req, res) => {
    const { date, event_id } = req.body;
    db.addSchedule({ date, event_id })
      .then(data => res.status(201).send(data.rows[0]));
  });

// router.get('/:eventId', (req, res) => {
//   const { eventId } = req.params;
//   db.getSchedulesByEvent(eventId)
//     .then((schedulesData) => {
//       return Promise.all(schedulesData.rows.map((schedule) => {
//         const { date } = schedule;
//         return db.getActivitiesByDay(schedule.id)
//           .then((activitiesData) => {
//             return Promise.all(activitiesData.rows.map((actData) => {
//               const activity = actData;
//               return db.getGroupNamesByActivity(activity.id)
//                 .then((groups) => {
//                   // assign arbitrary date to time in order to parse in front end
//                   activity.starttime = new Date(`1970-01-01T${activity.starttime}`);
//                   activity.endtime = new Date(`1970-01-01T${activity.endtime}`);
//                   activity.groups = groups.rows;
//                   return activity;
//                 });
//             }));
//           })
//           .then((timetable) => {
//             return { date, timetable };
//           });
//       }));
//     })
//     .then((results) => {
//       res.status(200).send(results);
//     });
// });

const getGroupsByActivityHelper = activity => (
  db.getGroupNamesByActivity(activity.id)
    .then((groups) => {
      // assign arbitrary date to time in order to parse in front end
      activity.starttime = new Date(`1970-01-01T${activity.starttime}`);
      activity.endtime = new Date(`1970-01-01T${activity.endtime}`);
      activity.groups = groups.rows;
      return activity;
    })
);

router.get('/:eventId', (req, res) => {
  const { eventId } = req.params;
  let date;
  db.getSchedulesByEvent(eventId)
    .then((schedulesData) => {
      const promiseArr = [];
      schedulesData.rows.forEach((schedule) => {
        date = schedule.date;
        promiseArr.push(db.getActivitiesByDay(schedule.id)
          .then((activitiesData) => {
            const promiseArrActivities = [];
            activitiesData.rows.forEach((actData) => {
              const activity = actData;
              promiseArrActivities.push(getGroupsByActivityHelper(activity));
            });
            return Promise.all(promiseArrActivities);
          })
          .then(timetable => (
            { date, timetable }
          )));
      });
      return Promise.all(promiseArr);
    })
    .then((results) => {
      res.status(200).send(results);
    });
});

router.get('/:eventId/:groupId', (req, res) => {
  const { eventId, groupId } = req.params;
  db.getSchedulesByEvent(eventId)
    .then((schedulesData) => {
      return Promise.all(schedulesData.rows.map((schedule) => {
        const { id, date } = schedule;
        return db.getActivitiesByDayByGroup(id, groupId)
          .then(activitiesData => activitiesData.rows)
          .then((timetable) => {
            return { date, timetable };
          });
      }));
    })
    .then((results) => {
      res.status(200).send(results);
    });
});

module.exports = router;
