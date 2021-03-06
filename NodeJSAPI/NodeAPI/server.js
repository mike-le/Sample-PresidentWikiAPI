var express = require('express');
var app = express();
var sql = require("mssql");
var port = process.env.PORT || 3001;
var router = express.Router();
var conn = require("./connect")();
var cors = require('cors'); 

app.use(cors());

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next(); 
});

router.get('/presidents/:sort', function(req, res) {
    var sort = req.params.sort;
    conn.connect().then(function () {
        var sqlQuery = "Select * FROM Presidents ORDER BY name " + sort;
        var req = new sql.Request(conn);
        req.query(sqlQuery)
        .then(function (recordset) {
            res.json(recordset.recordset);
            conn.close();
        })
        .catch(function () {
            conn.close();
            res.status(400).send("Bad Request: Error while inserting data.");
        });
    }).catch(function (){
        conn.close();
        res.status(400).send("Bad Request: Could not connect to server.");
    });
});

app.use('/api', router);
 
app.listen(port, function () {
    var datetime = new Date();
    var message = "Server runnning on Port:- " + port + "Started at :- " + datetime;
    console.log(message);
});