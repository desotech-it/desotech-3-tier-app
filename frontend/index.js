const express = require('express');
const request = require('request');

const app = express();
const port = 3000;
const restApiUrl = process.env.API_URL;

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
    request(restApiUrl, { method: "GET" }, function(err, resp, body) {
        if (!err && resp.statusCode === 200) {
            console.log(`Frontend Running Successfully`);
            var objData = JSON.parse(body);
            var c_cap = objData.data;
            var responseString = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br><table><tr><th>Country</th><th>Capital</th></tr>`;

            for (var i = 0; i < c_cap.length; i++)
                responseString += `<tr><td>${c_cap[i].country}</td><td>${c_cap[i].capital}</td></tr>`;

            responseString += `</table></body></html>`;
            res.send(responseString);
        } else {
            console.log(err);
            console.error(err);
            var responseString = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br>`;
            responseString += `<h1>API Server not available</h1></body></html>`;
            res.send(responseString);
        }
    });
});

app.listen(port, () => console.log(`Frontend app listening on port ${port}!`));
