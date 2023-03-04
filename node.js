var express = require('express')
var app = express();
var server = express();
var port = 2000;


const path = require('path');
const {
    unwatchFile,
    rmSync,
    readSync,
    appendFile,

} = require('fs');

/*------------------intialize body-parser--------------------*/

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: false
})); // support encoded bodies



/*----------------database---------------------------------*/

var mysql = require('mysql');
const { query } = require('express');
var connection = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cypher'
});



connection.connect(function (error) {

    if (!!error) {
        console.log('Error Connecting in database.');
    }
    else {
        console.log('Connected to Database.');
    }
});


/*-------------------start view engine------------------------*/
app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');




app.get("/", function (req, res) {
    // res.render('home',{message:req.flash('message')});
    res.render('home', {
        message: ''
    })
})


app.post("/", urlencodedParser, function (req, res) {
    var name = req.body.name
    var msg = req.body.msg

    if (name === "" || msg === "") {
        res.render('home', { message: 'Please fill up the fields properly.' })
    }
    else {
        var already_present = 'select count(Email) as cnt from questions where Email="' + name + '" and Message="' + msg + '"'
        connection.query(already_present, function (error, data, fields) {
            if (!!error) {

                res.render('home', { message: 'Error Occured !' })

            } else {

                console.log(data)
                if (data[0].cnt===0) {
                    var query = "insert into questions values('" + name + "','" + msg + "')";
                    connection.query(query, function (error, datas, fields) {
                        if (!!error) {

                            res.render('home', { message: 'Error Occured !' })

                        } else {

                            res.render('home', { message: 'Sent Successfully :)' })

                        }
                    });

                }
                else {
                    
                    res.render('home', { message: 'You have already asked this question !' })
                }

            }
        });
    }



})

app.get("/about-crypto", function (req, res) {
    res.render('about-crypto');
})

app.get("/ceaser", function (req, res) {
    res.render("ceaser");
})
app.get("/rsa", function (req, res) {
    res.render("rsa");
})
app.get("/hill", function (req, res) {
    res.render("hill");
})
app.get("/monoalphabetic", function (req, res) {
    res.render("monoalphabetic");
})
app.get("/polyalphabetic", function (req, res) {
    res.render("polyalphabetic");
})

app.get("/image", function (req, res) {
    res.render("image");
})
app.get("/steganography", function (req, res) {
    res.render("steganography");
})



app.listen(port, function () {
    console.log('Server listenning to port ' + port);
});


