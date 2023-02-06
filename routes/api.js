var express = require("express");
var router = express.Router();
var fs = require("fs");

/* List of API */
router.get("/", function (req, res, next) {
  res.render("list", {
    title: "Full Stack Engg Overview",
    apilist: [
      {
        name: `${req.headers.host}/api/user`,
        description: "All User Listing",
        method: "get",
      },
      {
        name: `${req.headers.host}/api/user/register`,
        description: "New User Register",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/update`,
        description: "Existing User Update",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/login`,
        description: "User Authentication",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/search`,
        description: "User Search",
        method: "get",
      },
      {
        name: `${req.headers.host}/api/user/profile`,
        description: "User Profile View",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/mongo`,
        description: "User Mongo View",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/sql`,
        description: "User SQL View",
        method: "post",
      },
    ],
  });
});

/* All User Listing */
router.get("/user", function (req, res, next) {
  const users = require("../users");
  res.send({ status: "success", data: users, msg: "" });
});

/* New User Register */
router.post("/user/register", function (req, res, next) {
  console.log("req.body -> ", req.body);
  const users = require("../users");
  let newUsers = users.filter(function (e) {
    console.log("Bharani_name", e.name);
    console.log("Bharani_name2", req.body.name);
    return e.name == req.body.name;
  });
  if (newUsers.length > 0) {
    res.send({ status: "failed", data: {}, msg: "User Already Exists" });
  } else {
    users.push(req.body);
    fs.writeFile("./users.json", JSON.stringify(users), (err) => {
      // Checking for errors
      if (err)
        res.send({
          status: "failed",
          data: {},
          msg: `Something went wrong ${err}`,
        });
      res.send({ status: "success", data: req.body, msg: "" });
    });
  }
});

/* Existing User Update */
router.post("/user/update", function (req, res, next) {
  console.log("req.body -> ", req.body);
  const users = require("../users");
  let newUsers = users.filter(function (e) {
    return e.name == req.body.name;
  });
  if (newUsers.length > 0) {
    users.push(req.body);
    fs.writeFile("./users.json", JSON.stringify(users), (err) => {
      // Checking for errors
      if (err)
        res.send({
          status: "failed",
          data: {},
          msg: `Something went wrong ${err}`,
        });
      res.send({ status: "success", data: req.body, msg: "" });
    });
  } else {
    res.send({ status: "failed", data: {}, msg: "User Not Existing" });
  }
});


/* User Authentication */
router.post("/user/login", function (req, res, next) {
  console.log("req.body -> ", req.body);
  const users = require("../users");
  let newUsers = users.filter(function (e) {
    return e.name == req.body.name && e.password == req.body.password;
  });
  if (newUsers.length > 0) {
    res.send({ status: "success", data: newUsers[0], msg: "" });
    console.log("User Data is : ", newUsers[0]);
  } else {
    res.send({ status: "failed", data: {}, msg: "No UserId / Password Found" });
  }
});

/* User Search */
router.get("/user/search", function (req, res, next) {
  console.log("Bharani Check now");
  console.log("req.body -> ", req.query);
  const users = require("../users");
  console.log(users);
  let newUsers = users.filter(function (e) {
    return e.name && e.name.toLowerCase().includes(req.query.q.toLowerCase());
  });
  if (newUsers.length > 0) {
  res.send({ status: "success", data: newUsers[0], msg: "" });
} else {
  res.send({ status: "failed", data: {}, msg: "No User Name Found" });
}
});

/* User Profile */
router.post("/user/profile", function (req, res, next) {
  console.log("req.body -> ", req.body);
  const users = require("../users");
  let newUsers = users.filter(function (e) {
    return e.name == req.body.name;
  });
  if (newUsers.length > 0) {
    res.send({ status: "success", data: newUsers[0], msg: "" });
    console.log("User Profile is : ", newUsers[0]);
  } else {
    res.send({ status: "failed", data: {}, msg: "No Profile Found" });
  }
});

/* User Mongo */
router.post("/user/mongo", function (req, res, next) {
  var axios = require('axios');
var data = JSON.stringify({
    "collection": "users",
    "database": "mkutest",
    "dataSource": "Cluster0",
    "filter": {
        name: "user",
    }
});
            
var config = {
    method: 'post',
    url: 'https://data.mongodb-api.com/app/data-jfeeu/endpoint/data/v1/action/find',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': 'xrKFzXZV5Ive5fg4NbGuruUt5jcRdoM4z9RioXbxQEKcFdJFvcLZxaVsGxyecNcU',
      'Accept': 'application/ejson'
    },
    data: data
};
            
axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
        res.send({ status: "success", data: response.data, msg: "" });
    })
    .catch(function (error) {
        console.log(error);
    });

});

/* User SQL */
router.post("/user/sql", function (req, res, next) {
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "0.0.0.0",
  user: "root",
  password: "12345678",
  database: "mku"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "UPDATE user SET name = 'Dharann' WHERE email = 'bharani.dharan@gmail.com'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Data Updated");
    res.send({ status: "success", data: "Data Updated", msg: "" });
  });
});
});

module.exports = router;
