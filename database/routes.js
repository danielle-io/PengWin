const environment = require("../database/sqlConfig");

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

// Starting our app.
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createPool({
  host: environment.host,
  user: environment.user,
  password: environment.password,
  database: environment.database,
});

app.get("/users", function(req, res) {
  db.getConnection(function(err, connection) {
    connection.query("SELECT * FROM users", function(error, results, fields) {
      connection.release();
      if (error) throw error;
      res.send(results);
    });
  });
});

app.get("/getChildFromParent/:userId", function(req, res) {
  let userId = req.params.userId;
  db.getConnection(function(err, connection) {
    connection.query(
      "select * from children " +
        "inner join users on children.user_id = users.user_id where parent_id = ?",
      [userId],
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        res.send(results);
      }
    );
  });
});


app.get("/getUnevaluatedRoutines/:parentId", function(req, res) {
  let parentId = req.params.parentId;
  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM child_notifications where parent_id = ?" +
        " AND is_evaluated = 0" +
        " AND requires_approval = 1" +
        " AND in_progress = 0", [parentId],
      function(error, results, fields) {
        connection.release();

        if (error) throw error;

        res.send(results);
      }
    );
  });
});

app.get("/getImagePathFromNotifcations/:childNotificationsId", function(
  req,
  res
) {
  let childNotificationsId = req.params.childNotificationsId;
  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM child_notifications where child_notifications_id = ?",
      [childNotificationsId],
      function(error, results, fields) {
        connection.release();
        if (error) throw error;
        console.log(results);
        res.send(results);
      }
    );
  });
});

app.get("/getParentIdOfUser/:userId", function(req, res) {
  let userId = req.params.userId;
  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT parent_id FROM parents where user_id =" + userId,
      function(error, results, fields) {
        connection.release();

        if (error) throw error;

        res.send(results);
      }
    );
  });
});

// Update the routine data
app.post("/updateRoutine/:routineId", function(req, res) {
  let routineId = req.params.routineId;
  var postData = req.body;
  console.log(
    "updating routine, routine id is " + routineId + " data is " + postData
  );
  db.getConnection(function(err, connection) {
    connection.query(
      "UPDATE routines SET ? WHERE routine_id = ?",
      [postData, routineId],
      function(error, results, fields) {
        connection.release();

        if (error) {
          throw error;
          console.log(err);
        }
        console.log("RESULTS ARE " + JSON.stringify(results));
        res.send(JSON.stringify(results));
      }
    );
  });
});

// Update the routine data
app.post('/updateChildNotificationsTable/:childNotificationId', function (req, res) {
  let childNotificationId = req.params.childNotificationId;
  var postData = req.body;

  console.log("updating child notifs, id is " + childNotificationId);

  db.getConnection(function (err, connection) {
    
    connection.query('UPDATE child_notifications SET ? WHERE child_notifications_id = ?',
      [postData, childNotificationId],
     
      function (error, results, fields) {
        connection.release();
        if (error){
          throw error;
          console.log(err);
        }
        console.log("RESULTS ARE " + results);
        res.send(JSON.stringify(results))
      });
  });
});

// Update the routine data
app.post('/updateActivityRelationship/:routineActivityId', function (req, res) {
  let routineActivityId = req.params.routineActivityId;
  var postData = req.body;
  db.getConnection(function(err, connection) {
    connection.query(
      "UPDATE routines_activities_relationship SET ? WHERE routine_activity_id = ?",
      [postData, routineActivityId],
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        res.send(JSON.stringify(results));
      }
    );
  });
});

// Update the user data
app.post("/updateUser/:userId", function(req, res) {
  let userId = req.params.userId;
  var postData = req.body;
  db.getConnection(function(err, connection) {
    connection.query(
      "UPDATE users SET ? WHERE user_id = ?",
      [postData, userId],
      function(error, results, fields) {
        connection.release();

        if (error) {
          throw error;
          console.log(err);
        }
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.post("/incrementChildRoutines/:childID", function(req, res) {
  let childID = req.params.childID;

  db.getConnection(function(err, connection) {
    connection.query(
      "UPDATE children SET routines_complete = routines_complete + 1 WHERE child_id =" +
        childID,
      [postData, childID],
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.post("/updateActivity/:activityId", function(req, res) {
  let activityId = req.params.activityId;
  var postData = req.body;
  console.log(postData);
  db.getConnection(function(err, connection) {
    connection.query(
      "UPDATE activities SET ? WHERE activity_id = ?",
      [postData, activityId],
      function(error, results, fields) {
        connection.release();

        if (error) {
          throw error;
          console.log(err);
        }
        console.log(results);
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.post('/updateRoutineRequiresApproval/:routine_id', function (req, res) {

  let routine_id = req.params.routine_id;
  var postData = req.body;

  console.log(postData);
  connection.getConnection(function (err, connection) {
    connection.query('UPDATE child_notifications SET ? WHERE routine_id = ?',
      [postData, routine_id],
      function (error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        res.send(JSON.stringify(results))
      });
  });
});

app.post('/insertRoutine', function (req, res) {
  var postData = req.body;
  db.getConnection(function(err, connection) {
    connection.query("INSERT INTO routines SET ?", postData, function(
      error,
      results,
      fields
    ) {
      connection.release();
      if (error) {
        throw error;
        console.log(err);
      }
      res.send(JSON.stringify(results));
    });
  });
});

app.post("/insertActivity", function(req, res) {
  console.log("inserting");
  var postData = req.body;
  db.getConnection(function(err, connection) {
    connection.query("INSERT INTO activities SET ?", postData, function(
      error,
      results,
      fields
    ) {
      connection.release();
      if (error) {
        throw error;
        console.log(err);
      }
      console.log(results);
      res.send(JSON.stringify(results));
    });
  });
});

app.post("/insertChildRoutineNotifications", function(req, res) {
  var postData = req.body;
  db.getConnection(function(err, connection) {
    connection.query(
      "INSERT INTO child_notifications SET ?",
      postData,
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        console.log(JSON.stringify(results));

        res.send(JSON.stringify(results));
      }
    );
  });
});

// Update the routine data
app.post("/updateChildNotifications/:childNotificationsId", function(req, res) {
  let childNotificationsId = req.params.childNotificationsId;
  var postData = req.body;
  db.getConnection(function(err, connection) {
    connection.query(
      "UPDATE child_notifications SET ? WHERE child_notifications_id = ?",
      [postData, childNotificationsId],
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.post("/updatePreferences/:user_preference_id", function(req, res) {
  let user_preference_id = req.params.user_preference_id;
  var postData = req.body;
  console.log(postData);
  db.getConnection(function(err, connection) {
    connection.query(
      "UPDATE user_preferences SET ? WHERE user_preference_id =" +
        user_preference_id,
      [postData, user_preference_id],
      function(error, results, fields) {
        connection.release();

        if (error) {
          console.log(error);
          throw error;
        }
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.post("/insertRoutineActivityRelationship", function(req, res) {
  var postData = req.body;
  db.getConnection(function(err, connection) {
    connection.query(
      "INSERT INTO routines_activities_relationship  SET ?",
      postData,
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        console.log(JSON.stringify(results));
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.post("/insertContainerRoutineRelationship", function(req, res) {
  console.log("insertContainerRoutineRelationship");

  var postData = req.body;
  db.getConnection(function(err, connection) {
    connection.query(
      "INSERT INTO container_routine_relationship  SET ?",
      postData,
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        console.log(JSON.stringify(results));
        res.send(JSON.stringify(results));
      }
    );
  });
});

// Update the routine data
app.post("/updateContainer/:containerId", function(req, res) {
  let containerId = req.params.containerId;
  var postData = req.body;
  console.log("updating container, container id is " + containerId);
  db.getConnection(function(err, connection) {
    connection.query(
      "UPDATE containers SET ? WHERE container_id = ?",
      [postData, containerId],
      function(error, results, fields) {
        connection.release();

        if (error) {
          throw error;
          console.log(err);
        }
        console.log("RESULTS ARE " + JSON.stringify(results));
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.post("/updateRoutineTagTable/:containerRoutineId", function(req, res) {
  let containerRoutineId = req.params.containerRoutineId;
  var postData = req.body;
  console.log("updating containerRoutineId " + containerRoutineId);
  db.getConnection(function(err, connection) {
    connection.query(
      "UPDATE container_routine_relationship SET ? WHERE container_routine_id = ?",
      [postData, containerRoutineId],
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.post("/insertNewContainer", function(req, res) {
  var postData = req.body;
  db.getConnection(function(err, connection) {
    connection.query("INSERT INTO containers  SET ?", postData, function(
      error,
      results,
      fields
    ) {
      connection.release();
      if (error) {
        throw error;
        console.log(err);
      }
      console.log(JSON.stringify(results));

      res.send(JSON.stringify(results));
    });
  });
});

app.post("/insertRewards", function(req, res) {
  var postData = req.body;
  db.getConnection(function(err, connection) {
    connection.query("INSERT INTO rewards SET ?", postData, function(
      error,
      results,
      fields
    ) {
      connection.release();
      if (error) {
        throw error;
        console.log(err);
      }
      res.send(JSON.stringify(results));
    });
  });
});



//update rewards
app.post("/updateReward:rewardId", function(req, res) {
  let rewardId = req.params.rewardId;
  var postData = req.body;
  console.log(
    "updating reward, reward id is " + rewardId + " data is " + postData
  );
  db.getConnection(function(err, connection) {
    connection.query(
      "UPDATE rewards SET ? WHERE reward_id = ?",
      [postData, rewardId],
      function(error, results, fields) {
        connection.release();

        if (error) {
          throw error;
          console.log(err);
        }
        console.log("RESULTS ARE " + JSON.stringify(results));
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.get("/getUser/:userId", function(req, res) {
  let userId = req.params.userId;
  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId],
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        res.send(results);
      }
    );
  });
});

app.get("/getContainers/:userId", function(req, res) {
  let userId = req.params.userId;
  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM containers WHERE deleted <> 1 AND user_id = ?",
      [userId],
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        console.log(results);
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.get("/getContainersPerRoutines/:userId", function(req, res) {
  let userId = req.params.userId;
  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM container_routine_relationship WHERE deleted <> 1 AND user_id = ?",
      [userId],
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(err);
        }
        console.log(results);
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.get("/getActivities/:userId", function(req, res) {
  let userId = req.params.userId;

  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM activities where deleted <> 1 AND user_id =" + userId,
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(error);
        }

        res.send(results);
      }
    );
  });
});

app.get("/getAllRelationshipsForActivity/:activityId", function(req, res) {
  let activityId = req.params.activityId;
  console.log("looking at relationship activity id is " + activityId);

  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM routines_activities_relationship where activity_id =" +
        activityId,
      function(error, results, fields) {
        connection.release();
        if (error) {
          throw error;
          console.log(error);
        }
        console.log(JSON.stringify(results));
        res.send(JSON.stringify(results));
      }
    );
  });
});

app.get("/getPublicActivities/:userId", function(req, res) {
  let userId = req.params.userId;

  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM activities where is_public = 1 AND deleted <> 1 AND user_id <> " +
        userId,
      function(error, results, fields) {
        connection.release();
        console.log("get public activities call");
        console.log(results);
        if (error) {
          throw error;
          console.log(error);
        }

        res.send(results);
      }
    );
  });
});

app.get("/getActivitiesFromRoutine/:routineID", function(req, res) {
  let routineID = req.params.routineID;

  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM routines_activities_relationship where routine_id =" +
        routineID,
      function(error, results, fields) {
        connection.release();

        console.log(results);
        console.log(error);
        if (error) throw error;

        res.send(results);
      }
    );
  });
});

// app.get("/getImagePathFromRewards/:rewardId", function(
//   req,
//   res
// ) {
//   let childNotificationsId = req.params.childNotificationsId;
//   db.getConnection(function(err, connection) {
//     connection.query(
//       "SELECT * FROM rewards where reward_id = ?",
//       [rewardId],
//       function(error, results, fields) {
//         connection.release();
//         if (error) throw error;
//         console.log(results);
//         res.send(results);
//       }
//     );
//   });
// });


app.get("/getAllRewards/:userId", function(req, res) {
  let userId = req.params.userId;

  db.getConnection(function(err, connection) {
    connection.query("SELECT * FROM rewards WHERE deleted <> 1 AND user_id =" + userId, function(
      error,
      results,
      fields
    ) {
      connection.release();

      if (error) {
        throw error;
        console.log(err);
      }
      console.log(results);
      res.send(results);
    });
  });
});

app.get("/getAllRewardsandRoutines/:userId", function(req, res) {
  let userId = req.params.userId;

  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM rewards AS rew, routines AS route WHERE rew.user_id = route.user_id AND route.reward_id = rew.reward_id AND rew.user_id =" +
        userId,
      function(error, results, fields) {
        connection.release();

        if (error) {
          throw error;
          console.log(err);
        }
        res.send(results);
      }
    );
  });
});

app.get("/getAllRewardsfromActivities/:activityId", function(req, res) {
  let activityId = req.params.activityId;

  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM rewards AS reward, activities AS activity, reward_activity_relationship as relationship WHERE relationship.activity_id = activity.activity_id AND reward.reward_id = relationship.reward_id AND activity.activity_id ="  + activityId,
      function(error, results, fields) {
        connection.release();

        if (error) {
          throw error;
          console.log(err);
        }
        res.send(results);
      }
    );
  });
});

app.get("/getRewardById/:rewardId", function(req, res) {
  let rewardId = req.params.rewardId;

  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM rewards WHERE deleted <> 1 AND reward_id =" + rewardId,
      function(error, results, fields) {
        connection.release();

        if (error) {
          throw error;
          console.log(err);
        }

        res.send(results);
      }
    );
  });
});

app.get("/getActivityById/:activityId", function(req, res) {
  let activityId = req.params.activityId;
  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM activities where activity_id =" + activityId,
      function(error, results, fields) {
        connection.release();

        if (error) {
          throw error;
          console.log(err);
        }
        res.send(results);
      }
    );
  });
});

app.get("/joinRoutineActivityTableByRoutineId/:routineId", function(req, res) {
  let routineId = req.params.routineId;
  db.getConnection(function(err, connection) {
    connection.query(
      "select routines.*, a.*, rar.order, rar.routine_activity_id from routines " +
        "inner join routines_activities_relationship rar on routines.routine_id = rar.routine_id " +
        "inner join activities a on rar.activity_id = a.activity_id " +
        "where rar.routine_id = ? AND rar.routine_id <> 0 AND rar.deleted <> 1 " +
        "order by rar.order",
      [routineId],
      function(error, results, fields) {
        connection.release();
        // console.log('routine routes below');
        // console.log(results);
        // console.log(error);

        if (error) {
          throw error;
          console.log(err);
        }
        // console.log("RESULTS FROM JOINING");
        // console.log(results);
        res.send(results);
      }
    );
  });
});

app.get("/getAmountOfActivitiesInRoutine/:routineId", function(req, res) {
  let routineId = req.params.routineId;

  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM routines_activities_relationship where routine_id=? AND deleted <> 1 ",
      [routineId],
      function(error, results, fields) {
        connection.release();
        if (error) throw error;

        res.send(results);
      }
    );
  });
});



app.get("/getRoutinesByUser/:userId", function(req, res) {
  let userId = req.params.userId;
  console.log("in get routines userId " + userId);

  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM routines where user_id=? AND routine_id <> 0 AND deleted <> 1 ",
      [userId],
      function(error, results, fields) {
        connection.release();
        console.log("here end of results");

        if (error) console.log(error);

        console.log(results);
        res.json({ routines: results });
      }
    );
  });
});

app.get("/getRoutinesByRoutineId/:routineId", function(req, res) {
  let routineId = req.params.routineId;

  db.getConnection(function(err, connection) {
    connection.query(
      "SELECT * FROM routines where routine_id=? AND routine_id <> 0 ",
      [routineId],
      function(error, results, fields) {
        connection.release();
        if (error) throw error;

        res.json({ routines: results });
      }
    );
  });
});

app.listen(3000, () => {
  console.log("Go to http://localhost:3000/users so you can see the data.");
});
