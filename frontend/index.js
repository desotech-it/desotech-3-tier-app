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
                if (err) {
                    callback(err);
                    return;
                }

                if (resp.statusCode !== 200) {
                    callback(new Error("Bad status code from root API call"));
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
                if (err) {
                    callback(err);
                    return;
                }

                if (resp.statusCode !== 200) {
                    callback(new Error("Bad status code from data API call"));
                    return;
                }
                callback(null, JSON.parse(body));
            });
        }
    }, function(err, results) {
        if (err) {
            console.error(err);
            var errorResponse = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br>`;

            if (err.code === 'ESOCKETTIMEDOUT') {
                errorResponse += `<h1>Error: Backend Server cannot connect to the Database</h1>`;
                errorResponse += `<p>${err.message}</p>`;
            } else {
                errorResponse += `<h1>Error: Unable to connect to the Backend Server</h1>`;
                errorResponse += `<p>${err.message}</p>`;
            }

            res.status(500).send(errorResponse);
            return;
        }

        // Raccogli i risultati in una variabile
        var rootData = results.root;
        var c_cap = results.data.data;

        // Costruisci la stringa di risposta come desideri
        var responseString = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br>`;
        responseString += `<h1>Connection to Backend successfully.</h1>`;

        // Prima tabella con /data
        responseString += `<table><tr><th>Country</th><th>Capital</th></tr>`;
        for (var i = 0; i < c_cap.length; i++)
            responseString += `<tr><td>${c_cap[i].country}</td><td>${c_cap[i].capital}</td></tr>`;
        responseString += `</table>`;

        // Seconda tabella con /
        responseString += `<h1>Information of Backend Pod:</h1>`;
        responseString += `<table><tr><th>Property</th><th>Value</th></tr>`;
        for (const [key, value] of Object.entries(rootData)) {
            if (key === 'ContainerIP') {
                for (const [interfaceName, interfaceList] of Object.entries(value)) {
                    for (const interface of interfaceList) {
                        if (interface.family === 'IPv4') {
                            responseString += `<tr><td>${interfaceName} IPv4 Address</td><td>${interface.address}</td></tr>`;
                        }
                        if (interface.family === 'IPv6') {
                            responseString += `<tr><td>${interfaceName} IPv6 Address</td><td>${interface.address}</td></tr>`;
                        }
                    }
                }
            } else {
                responseString += `<tr><td>${key}</td><td>${value}</td></tr>`;
            }
        }
        responseString += `</table>`;
        responseString += `</body></html>`;

        // Risposta finale
        res.send(responseString);
    });
});

app.listen(port, function() {
    console.log(`Frontend server is running on port ${port}`);
});
