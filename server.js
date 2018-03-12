const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var app = express();

// used to place partial snippets (.abs files).
hbs.registerPartials(__dirname + '/views/partials');

// using hbs helper functions, first param name of the helper function, second param is a callback function.
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//app.use is used to register a middleware. it is executed in the order we call app.use
//app.use(express.static(__dirname+'/public'));we need to move this down so that we can test the maintanence hbs.

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintanence.hbs');
// });

app.use(express.static(__dirname+'/public'));
// used to set a hbs key-value pair.
app.set('view engine', 'hbs');

// setting up the root directory.
app.get('/', (req, res) => {
    //res.send('<h1>Hello Express</h1>');
    res.render('home.hbs', {
        welcomeMessage: 'Welcome to my page!',
        pageTitle: 'Home Page',
        currentYear: new Date().getFullYear()
    })
});

// setting up about directory.
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
        currentYear: new Date().getFullYear()
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request!'
    })
});

// deploying a local sever that listens at port 3000 http://localhost:3000
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});