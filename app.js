const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

let app = express();
let port = 3000;
let herokuPort = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {res.sendFile(`${__dirname}/signup.html`);});

app.post('/', (req, res) => {
    let email = req.body.email;
    let firstName = req.body.first_name;
    let lastName = req.body.last_name;

    let data = {
        // Get more details on https://mailchimp.com/developer/guides/get-started-with-mailchimp-api-3/
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    let jsonData = JSON.stringify(data);

    let options = {
        url: "https://usX.api.mailchimp.com/3.0/lists/{list_id}", // provided by mailchimp
        method: "POST",
        headers: {"Authorization": "username api-key"},
        body: jsonData
    };

    request(options, (error, response, body) => {
        if (error) {
            res.sendFile(`${__dirname}/failure.html`);
        } else if(response.statusCode === 200){
            res.sendFile(`${__dirname}/success.html`);
        }else{res.sendFile(`${__dirname}/failure.html`);}
    });


});


app.post('/failure', (req, res) => {res.redirect('/');});


app.listen(port || herokuPort, () => {
    console.log(`Server is running on hhtp://localhost:${port}`);
});

