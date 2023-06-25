const express = require('express');
const request = require('request');
const async = require('async');

const app = express();
const port = 3000;
const backendUrl = process.env.API_URL;


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
    async.parallel({
        root: function(callback) {
            request({
                url: `${backendUrl}/`,
                method: "GET",
                timeout: 3000
            }, function(err, resp, body) {
                if (err || resp.statusCode !== 200) {
                    console.error(err || new Error("Bad status code from root API call"));
                    callback(err);
                    return;
                }
                callback(null, JSON.parse(body));
            });
        },
        data: function(callback) {
            request({
                url: `${backendUrl}/data`,
                method: "GET",
                timeout: 3000
            }, function(err, resp, body) {
                if (err || resp.statusCode !== 200) {
                    console.error(err || new Error("Bad status code from data API call"));
                    callback(err);
                    return;
                }
                callback(null, JSON.parse(body));
            });
        }
    }, function(err, results) {
        if (err) {
            var errorResponse = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br>`;
            errorResponse += `<h1>Unable to contact API Server</h1></body></html>`;
            res.status(500).send(errorResponse);
            return;
        }

        // Raccogli i risultati in una variabile
        var rootData = results.root;
        var c_cap = results.data.data;

        // Costruisci la stringa di risposta come desideri
        var responseString = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br>`;
        responseString += `<h1> Connection to Backend successfully.</h1>`;

        // Prima tabella con /data
        responseString += `<table><tr><th>Country</th><th>Capital</th></tr>`;
        for (var i = 0; i < c_cap.length; i++)
            responseString += `<tr><td>${c_cap[i].country}</td><td>${c_cap[i].capital}</td></tr>`;
        responseString += `</table>`;

// Seconda tabella con /
responseString += `<table><tr><th>Property</th><th>Value</th></tr>`;
for (const [key, value] of Object.entries(rootData)) {
    if (key === 'ContainerIP' && value.eth0) {
        // Mostra solo l'indirizzo IP dell'interfaccia eth0
        for (const interface of value.eth0) {
            if (interface.family === 'IPv4') {
                responseString += `<tr><td>${key}</td><td>${interface.address}</td></tr>`;
            }
        }
    } else {
        responseString += `<tr><td>${key}</td><td>${value}</td></tr>`;
    }
}
responseString += `</table>`;

        responseString += `</body></html>`;
        res.send(responseString);
    });
});

app.listen(port, () => console.log(`Frontend app listening on port ${port}!`));
