var express = require('express')
var app = express();
var server = express();
var port = 3000;
const nodemailer = require("nodemailer");


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
    var show = 'select * from questions'
    connection.query(show, function (error, data, fields) {
        if (!!error) {

            res.render('admin', { message: 'Error Occured !' })

        } else {

                
                res.render('admin', { message: '',userData:data })
        }

    
    });
   
})


app.post('/admin',urlencodedParser,function(req,res){
    post_data=req.body;
    console.log(post_data)

    const output = post_data.answer;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ProjectJoy22@gmail.com', // generated ethereal user
        pass: 'phynatuirovkopca', // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }

    });

    // send mail with defined transport object

    let mailOptions = {
      from: '"Project Joy" <ProjectJoy22@gmail.com>', // sender address
      to: post_data.user_email, // list of receivers
      subject: "Answer to your query", // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (!!error) {
            var show = 'select * from questions'
            connection.query(show, function (error, data, fields) {
                if (!!error) {
        
                    res.render('admin', { message: 'Error occured while connecting !',userData:data })
        
                } else {
        
                        
                        res.render('admin', { message: 'Message could not be sent !',userData:data })
                }
        
            
            });
      } else {
    
         var deletion="DELETE FROM `questions` WHERE `questions`.`Email` ='"+ post_data.user_email +"'AND `questions`.`Message` ='"+ post_data.user_question+"'"
         connection.query(deletion,function(error,datas,fileds){
            if(!!error){
                var show = 'select * from questions'
                connection.query(show, function (error, data, fields) {
                    if (!!error) {
                            res.render('admin',{message:'Error occured while connecting !',userData:data })
                    
                    } else {

                            console.log(error)
                 
                            res.render('admin', { message: 'Error occured while deletion !',userData:data })
                    }
                    
                        
                 });

                }else {
            
                        var show = 'select * from questions'
                        connection.query(show, function (error, data, fields) {
                            if (!!error) {
                                    res.render('admin',{message:'Error occured while connecting !',userData:data })
                            
                            } else {
                            
                             res.render('admin', { message:'Message Sent !',userData:data })
                            }
                            
                                
                        });
                            
                 }
            
                
                });
                
            }
         
         })


})



app.listen(port, function () {
    console.log('Server listenning to port ' + port);
});

