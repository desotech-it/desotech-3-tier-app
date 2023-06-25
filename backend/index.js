const express = require('express');
const {
    Pool,
    Client
} = require('pg');
const app = express();
const port = 3001;

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
});

app.enable('trust proxy');

app.get("/", function(req, res) {

    var os = require( 'os' );
    var networkInterfaces = os.networkInterfaces( );


    // var to store the json response
    var jsonRes = {
        ContainerIP: networkInterfaces,
        ContainerHostname : os.hostname(),
        XForwardedfor: req.headers['x-forwarded-for'],
        RemoteAddress: req.socket.remoteAddress,
        RemoteHost: req.headers['host'],
        language: req.headers["accept-language"] ? req.headers["accept-language"].split(",")[0] : null,
        software: req.headers["user-agent"].match(/\(([^)]+)\)/)[1],
    };

    // return the response in json format
    res.json(jsonRes);

})


app.get('/data', function(req, res) {
    pool.query('SELECT country, capital from country_and_capitals', [], (err, result) => {
        if (err) {
            return res.status(405).jsonp({
                error: err
            })

        }

        return res.status(200).jsonp({
            data: result.rows
        });

    });
});

app.listen(port, () => console.log(`Desotech API Backend os listening on port ${port}!`))
