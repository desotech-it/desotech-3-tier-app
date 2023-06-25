const express = require('express');
const { Pool, Client } = require('pg');
const app = express();
const port = 3001;

const pool = new Pool({
    connectionString: process.env.CONNECTION_STRING
});

// Funzione per gestire il tentativo di connessione al database
const connectToDatabase = async () => {
  while (true) {
    try {
      await pool.connect();
      console.log("Connected to the database successfully");
      break;
    } catch (err) {
      console.error("Failed to connect to the database. Retrying in 5 seconds...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Esegui la connessione al database all'avvio dell'app
connectToDatabase();

app.enable('trust proxy');

app.get("/", function(req, res) {
    var os = require( 'os' );
    var networkInterfaces = os.networkInterfaces();

    // variabile per immagazzinare la risposta JSON
    var jsonRes = {
        ContainerIP: networkInterfaces,
        ContainerHostname : os.hostname(),
        XForwardedfor: req.headers['x-forwarded-for'],
        RemoteAddress: req.socket.remoteAddress,
        RemoteHost: req.headers['host'],
    };

    // ritorna la risposta nel formato JSON
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

app.listen(port, () => console.log(`Desotech API Backend os listening on port ${port}!`));
