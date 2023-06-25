const express = require('express');
const request = require('request');

const app = express();
const port = 3000;
const backendUrl = 'http://backend-service.backend-namespace:3001';

// Aggiunta del CSS per la tabella e il logo
const css = `
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        img {
            margin-bottom: 20px;
        }

        table {
            border-collapse: collapse;
            width: 400px;
        }

        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
`;

app.get('/', function(req, res) {
    const apiUrl1 = `${backendUrl}`;
    const apiUrl2 = `${backendUrl}/data`;

    // Variabili per memorizzare i risultati delle richieste
    let result1, result2;

    // Funzione per inviare la risposta dopo aver ottenuto entrambi i risultati
    function sendResponse() {
        if (result1 && result2) {
            console.log(`Frontend Running Successfully`);
            var responseString = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"></br>`;

            // Aggiunta del JSON come tabella per la URI '/'
            var objData1 = JSON.parse(result1);
            responseString += `<h2>JSON Data from /:</h2>${convertToTable(objData1)}`;

            // Aggiunta del JSON come tabella per la URI '/data'
            var objData2 = JSON.parse(result2);
            responseString += `<h2>JSON Data from /data:</h2>${convertToTable(objData2)}`;

            responseString += `</body></html>`;
            res.send(responseString);
        } else {
            console.log("Unable to retrieve data from API Server");
            res.status(500).send("Unable to retrieve data from API Server");
        }
    }

    // Effettua la prima richiesta
    request({
        url: apiUrl1,
        method: "GET",
        timeout: 3000 // Timeout di 3 secondi
    }, function(err1, resp1, body1) {
        if (!err1 && resp1.statusCode === 200) {
            result1 = body1;
            sendResponse(); // Invia la risposta dopo aver ottenuto il primo risultato
        } else {
            console.log(err1);
            console.error(err1);
            result1 = null;
            sendResponse(); // Invia la risposta anche se la prima richiesta ha avuto errori
        }
    });

    // Effettua la seconda richiesta
    request({
        url: apiUrl2,
        method: "GET",
        timeout: 3000 // Timeout di 3 secondi
    }, function(err2, resp2, body2) {
        if (!err2 && resp2.statusCode === 200) {
            result2 = body2;
            sendResponse(); // Invia la risposta dopo aver ottenuto il secondo risultato
        } else {
            console.log(err2);
            console.error(err2);
            result2 = null;
            sendResponse(); // Invia la risposta anche se la seconda richiesta ha avuto errori
        }
    });
});


app.listen(port, () => console.log(`Frontend app listening on port ${port}!`));
