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
	software: req.headers["user-agent"] && req.headers["user-agent"].match(/\(([^)]+)\)/) ? req.headers["user-agent"].match(/\(([^)]+)\)/)[1] : null,
    };

    // return the response in json format
    res.json(jsonRes);

})


app.get('/data', function(req, res) {
  pool.query('SELECT country, capital FROM country_and_capitals', (err, result) => {
    if (err) {
      console.error("Errore nella query:", err);
      return res.status(500).json({
        error: "Si è verificato un errore durante l'esecuzione della query"
      });
    }

    if (result.rows.length === 0) {
      console.error("Dati non trovati");
      return res.status(404).json({
        error: "Dati non trovati"
      });
    }

    return res.status(200).json({
      data: result.rows
    });
  });
});




app.listen(port, () => console.log(`Desotech API Backend os listening on port ${port}!`))
