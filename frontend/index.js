const express = require('express');
const request = require('request');

const app = express();
const port = 3000;
const restApiUrl = process.env.API_URL;

app.get('/', function(req, res) {
    request(
        restApiUrl, {
            method: "GET",
        },
        function(err, resp, body) {
            if (!err && resp.statusCode === 200) {
                var objData = JSON.parse(body);
                var c_cap = objData.data;
                var responseString = `<html><body><img src="https://www.deso.tech/wp-content/uploads/2023/03/desotech-300x133.png" alt="logo" ></br><table border="1"><tr><td>Country</td><td>Capital</td></tr>`;

                for (var i = 0; i < c_cap.length; i++)
                    responseString = responseString +
                      `<tr><td>${c_cap[i].country}</td><td>${c_cap[i].capital}</td></tr>`;

                responseString = responseString + `</table></body></html>`;
                res.send(responseString);
            } else {
                console.error(err);
                res.status(500).send('Impossibile connettersi all\'API server');
            }
        });
});

app.listen(port, () => console.log(`Frontend app listening on port ${port}!`))
