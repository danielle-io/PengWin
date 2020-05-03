const environment = require('../database/sqlConfig');

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Starting our app.
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createPool({
  host: environment.host,
  user: environment.user,
  password: environment.password,
  database: environment.database
});

// the hardcoded user id for now
const userId = 1;

// Creating a GET route that returns data from the 'users' table.
app.get('/users', function (req, res) {
  // Connecting to the database.
  connection.getConnection(function (err, connection) {

    // INSERT INTO routines (name, start_time, end_time, is_approved) 
    // VALUES ('Routine Inc', Date(), Date(), 1)

    // Executing the MySQL query (select all data from the 'users' table).
    connection.query('SELECT * FROM users', function (error, results, fields) {
      // If some error occurs, we throw an error.
      if (error) throw error;

      // Getting the 'response' from the database and sending it to our route. This is were the data is.
      res.send(results)
    });
  });
});


app.get('/getChildFromParent/:userId', function (req, res) {
  let userId = req.params.userId;
  connection.getConnection(function (err, connection) {
    connection.query('select * from children '
      + 'inner join users on children.user_id = users.user_id where parent_id = ?', [userId], function (error, results, fields) {
        console.log(error);

        if (error) throw error;

        res.send(results)
      });
  });
});


app.get('/getUnevaluatedRoutines/:parentId', function (req, res) {
  let parentId = req.params.parentId;
  connection.getConnection(function (err, connection) {
    
    connection.query('SELECT * FROM child_notifications where parent_id =' + parentId
    + ' AND is_evaluated = 0'
    + ' AND requires_approval = 1' 
    + ' AND in_progress = 0', function (error, results, fields) {


        if (error) throw error;

        res.send(results)
      });
  });
});

app.get('/getParentIdOfUser/:userId', function (req, res) {
  let userId = req.params.userId;
  connection.getConnection(function (err, connection) {
    
    connection.query('SELECT parent_id FROM parents where user_id =' + userId, function (error, results, fields) {

        if (error) throw error;

        res.send(results)
      });
  });
});


// Update the routine data
app.post('/updateRoutine/:routineId', function (req, res) {

  let routineId = req.params.routineId;
  var postData = req.body;

  console.log(postData);
  connection.getConnection(function (err, connection) {

    connection.query('UPDATE routines SET ? WHERE routine_id = ?',
      [postData, routineId],
      function (error, results, fields) {

        if (error) {
          console.log('there was in error in updateRoutine');
          throw error;
        }
        res.send(JSON.stringify(results))
      });
  });
});


// Update the user data
app.post('/updateUser/:userId', function (req, res) {

  let userId = req.params.userId;
  var postData = req.body;

  console.log('routes data below');
  console.log(postData);
  connection.getConnection(function (err, connection) {

    connection.query('UPDATE users SET ? WHERE user_id = ?',
      [postData, userId],
      function (error, results, fields) {

        if (error) {
          console.log('there was in error in updateRoutine');
          throw error;
        }
        res.send(JSON.stringify(results))
      });
  });
});


app.post('/insertRoutine', function (req, res) {
  var postData = req.body;
  connection.query('INSERT INTO routines SET ?', postData, function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});


app.get('/user', function (req, res) {
  connection.getConnection(function (err, connection) {

    connection.query('SELECT * FROM users where user_id =' + userId, function (error, results, fields) {

      if (error) throw error;

      res.send(results)
    });
  });
});



// Creating a GET route that returns data from user 1 table.
app.get('/getUsers/:userId', function (req, res) {
  let userId = req.params.userId;
  connection.getConnection(function (err, connection) {

    connection.query('SELECT * FROM users WHERE user_id = ?', [userId], function (error, results, fields) {

      if (error) throw error;

      res.send(results)
    });
  });
});


app.get('/getActivities/:userId', function (req, res) {
  let userId = req.params.userId;

  connection.getConnection(function (err, connection) {

    connection.query('SELECT * FROM activities where user_id =' + userId, function (error, results, fields) {

      console.log(results);
      console.log(error);
      if (error) throw error;

      res.send(results)
    });
  });
});

app.get('/getActivitiesFromRoutine/:routineID', function (req, res) {
  let routineID = req.params.routineID;

  connection.getConnection(function (err, connection) {

    connection.query('SELECT * FROM routines_activities_relationship where routine_id =' + routineID, function (error, results, fields) {

      console.log(results);
      console.log(error);
      if (error) throw error;

      res.send(results)
    });
  });
});


app.get('/routines/:userId', function (req, res) {
  let userId = req.params.userId;

  connection.getConnection(function (err, connection) {

    connection.query('select routines.*, a.*, rar.order from routines '
      + 'inner join routines_activities_relationship rar on routines.routine_id = rar.routine_id '
      + 'inner join activities a on rar.activity_id = a.activity_id '
      + 'where routines.user_id = ? '
      + 'order by rar.routine_id, rar.order', [userId], function (error, results, fields) {

        console.log(err);
        if (error) throw error;

        res.send(results)
      });
  });
});


app.get('/routine/:routineId', function (req, res) {
  let routineId = req.params.routineId;
  connection.getConnection(function (err, connection) {

    connection.query('select routines.*, a.*, rar.order from routines '
      + 'inner join routines_activities_relationship rar on routines.routine_id = rar.routine_id '
      + 'inner join activities a on rar.activity_id = a.activity_id '
      + 'where routines.routine_id = ? '
      + 'order by rar.order', [routineId], function (error, results, fields) {
        console.log('routine routes below');
        console.log(results);
        console.log(error);

        if (error) throw error;

        res.send(results)
      });
  });
});

app.get('/routines', function (req, res) {
  connection.getConnection(function (err, connection) {

    connection.query('SELECT * FROM routines where user_id=' + userId, function (error, results, fields) {
      if (error) throw error;

      res.json({ 'routines': results });
    });
  });
});

app.listen(3000, () => {
  console.log('Go to http://localhost:3000/users so you can see the data.');
});
