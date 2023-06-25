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
                var rootData = {};
                if (err) {
                    console.error(err);
                    rootData = { error: "Unable to contact Backend API" };
                } else if (resp.statusCode !== 200) {
                    console.error(new Error("Bad status code from root API call"));
                    rootData = { error: "Bad status code from Backend API" };
                } else {
                    rootData = JSON.parse(body);
                }
                callback(null, rootData);
            });
        },
        data: function(callback) {
            request({
                url: `${backendUrl}/data`,
                method: "GET",
                timeout: 3000
            }, function(err, resp, body) {
                var data = [];
                if (err) {
                    console.error(err);
                } else if (resp.statusCode !== 200) {
                    console.error(new Error("Bad status code from data API call"));
                } else {
                    data = JSON.parse(body).data;
                }
                callback(null, data);
            });
        }
    }, function(err, results) {
        var rootData = results.root;
        var c_cap = results.data;

        var responseString = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br>`;
        responseString += `<h1>Connection to Backend successfully.</h1>`;

        if (rootData.error) {
            responseString += `<h2>${rootData.error}</h2>`;
        } else {
            // Seconda tabella con /
            responseString += `<h1>Information of Backend Pod:</h1>`;
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
        }

        if (c_cap.length > 0) {
            // Prima tabella con /data
            responseString += `<table><tr><th>Country</th><th>Capital</th></tr>`;
            for (var i = 0; i < c_cap.length; i++)
                responseString += `<tr><td>${c_cap[i].country}</td><td>${c_cap[i].capital}</td></tr>`;
            responseString += `</table>`;
        }

        responseString += `</body></html>`;
        res.send(responseString);
    });
});

app.listen(port, () => console.log(`Frontend app listening on port ${port}!`));
