const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3001;

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

app.enable('trust proxy');

const connectToDatabase = async () => {
  while (true) {
    try {
      const client = await pool.connect();
      client.release(); // release the client back to the pool
      console.log("Connected to the database successfully");
      break;
    } catch (err) {
      console.error("Failed to connect to the database. Retrying in 5 seconds...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

app.get("/", function(req, res) {
  var os = require( 'os' );
  var networkInterfaces = os.networkInterfaces();

  // var to store the json response
  var jsonRes = {
    ContainerIP: networkInterfaces,
    ContainerHostname : os.hostname(),
    XForwardedfor: req.headers['x-forwarded-for'],
    RemoteAddress: req.socket.remoteAddress,
    RemoteHost: req.headers['host'],
  };

  // return the response in json format
  res.json(jsonRes);
});

app.get('/data', function(req, res) {
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT country, capital FROM country_and_capitals', (err, result) => {
      done(); // release the client back to the pool
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
});

connectToDatabase().then(() => {
  app.listen(port, () => console.log(`Desotech API Backend os listening on port ${port}!`));
});
