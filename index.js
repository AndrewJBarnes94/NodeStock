const express = require('express');
const app = express();
const { engine } = require ('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

// Use Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));

// API KEY pk_ae4ec04a46e24d5ab079d55ac8d894c9
// Create Call API Function
function call_api(finishedAPI, ticker) {
    request('https://cloud.iexapis.com/stable/stock/' + ticker + '/quote?token=pk_ae4ec04a46e24d5ab079d55ac8d894c9', { json: true }, (err, res, body) => {
        if (err) {return console.log(err);}
        if (res.statusCode === 200){
            console.log(body)
            finishedAPI(body)
        };
    });
};

// Set Handlebars Middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Set Handlebars Index Route
app.get('/', function (req, res) {
    call_api(function(doneAPI) {
        res.render('home', {
            stock: doneAPI
        });    
    }, "fb");
});

// Set Handlebars Index POST Route
app.post('/', function (req, res) {
    call_api(function(doneAPI) {
        posted_stuff = req.body.tickerSymbol;
        res.render('home', {
            stock: doneAPI,
            posted_stuff: posted_stuff
        });    
    }, req.body.tickerSymbol);
});

/*
// Set Handlebars About Route
app.get('/about', function (req, res) {
    res.render('about');
});
*/

// Set Static Folder
app.unsubscribe(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log('Server Listening on port ' + PORT));