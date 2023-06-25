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

    request({
        url: apiUrl1,
        method: "GET",
        timeout: 3000 // Timeout di 3 secondi
    }, function(err1, resp1, body1) {
        if (!err1 && resp1.statusCode === 200) {
            request({
                url: apiUrl2,
                method: "GET",
                timeout: 3000 // Timeout di 3 secondi
            }, function(err2, resp2, body2) {
                if (!err2 && resp2.statusCode === 200) {
                    console.log(`Frontend Running Successfully`);
                    var objData1 = JSON.parse(body1);
                    var objData2 = JSON.parse(body2);
                    var c_cap = objData1.data;

                    // Verifica se c_cap è definita
                    if (c_cap) {
                        var responseString = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br><table><tr><th>Country</th><th>Capital</th></tr>`;

                        for (var i = 0; i < c_cap.length; i++)
                            responseString += `<tr><td>${c_cap[i].country}</td><td>${c_cap[i].capital}</td></tr>`;

                        responseString += `</table></body></html>`;

                        // Aggiunta del JSON come tabella sotto la tabella esistente
                        var jsonTable1 = convertToTable(objData1);
                        var jsonTable2 = convertToTable(objData2);
                        responseString += `<h2>JSON Data from /:</h2>${jsonTable1}`;
                        responseString += `<h2>JSON Data from /data:</h2>${jsonTable2}`;

                        res.send(responseString);
                    } else {
                        var errorResponse = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br>`;
                        errorResponse += `<h1>Data not available</h1></body></html>`;
                        res.status(500).send(errorResponse);
                    }
                } else {
                    console.log(err2);
                    console.error(err2);
                    var errorResponse = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br>`;
                    errorResponse += `<h1>Unable to contact API Server</h1></body></html>`;
                    res.status(500).send(errorResponse);
                }
            });
        } else {
            console.log(err1);
            console.error(err1);
            var errorResponse = `<html><head>${css}</head><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo"><br>`;
            errorResponse += `<h1>Unable to contact API


app.listen(port, () => console.log(`Frontend app listening on port ${port}!`));
