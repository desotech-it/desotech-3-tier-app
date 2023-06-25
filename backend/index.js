const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3001;

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

app.enable('trust proxy');

const connectToDatabase = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log("Connected to the database successfully");
    return true;
  } catch (err) {
    console.error("Failed to connect to the database.", err);
    return false;
  }
};

app.get("/", function(req, res) {
  var os = require( 'os' );
  var networkInterfaces = os.networkInterfaces();

  var jsonRes = {
    ContainerIP: networkInterfaces,
    ContainerHostname : os.hostname(),
    XForwardedfor: req.headers['x-forwarded-for'],
    RemoteAddress: req.socket.remoteAddress,
    RemoteHost: req.headers['host'],
  };

  res.json(jsonRes);
});

app.get('/data', async function(req, res) {
  const isConnected = await connectToDatabase();

  if (!isConnected) {
    console.error("Cannot connect to database");
    return res.status(500).json({ error: "Database connection failed" });
  }

  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT country, capital FROM country_and_capitals', (err, result) => {
      done();
      if (err) {
        console.error("Errore nella query:", err);
        return res.status(500).json({ error: "Si è verificato un errore durante l'esecuzione della query" });
      }

      if (result.rows.length === 0) {
        console.error("Dati non trovati");
        return res.status(404).json({ error: "Dati non trovati" });
      }

      return res.status(200).json({ data: result.rows });
    });
  });
});

app.listen(port, () => console.log(`Desotech API Backend os listening on port ${port}!`));
