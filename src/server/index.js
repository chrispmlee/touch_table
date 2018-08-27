/**
 * Created by chris on 2/20/2017.
 */

'use strict';


let express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    _               = require('underscore'),
    session         = require('express-session'),
    mongoose        = require('mongoose'),
    fs              = require('fs'),
    multiparty      = require('connect-multiparty'),
    path            = require('path'),
    multipartyMiddleware = multiparty(),
    mkdirp          = require('mkdirp');

// var User = require('./db').User;
// const Post = require('./db').Post;
// const Account  = require('./account');
// const MailerMock = require('./test/mailer-mock');
// var AccountController = require('./account');
// var crypt = require('crypto');
// var uuID = require('node-uuid');
// var UserSession = require('./user-session');
// var api_response = require('./api-response');


const AWS = require('aws-sdk');
const Busboy = require('busboy');
const config = require('./config');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');

const BUCKET_NAME = 'touch-table';
const IAM_USER_KEY = config.iamUser;
const IAM_USER_SECRET = config.iamSecret;

let s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
  Bucket: BUCKET_NAME
});

// mongoose.Promise = global.Promise;
// var db = mongoose.connection;
// db.on('error', console.error);

let app = express();
app.use(logger('combined'));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));
app.use(busboy());
app.use(busboyBodyParser())





//***********************************API********************************************************************

/**
 * 
 * Uploads project information and pictures 
 * 
 * **/
app.post('/v1/upload', function (req, res, next) {
    var busboy = new Busboy({ headers: req.headers });
 
    busboy.on('finish', function() {   // The file upload has completed
      var body = ' ';
      var dir = "C:/Users/chris/Desktop/temp/"; 
      var filePath = `${dir}/test.json`;
      const content = JSON.stringify(req.body);

      //upload the object data to s3
      s3bucket.putObject({
        Bucket: BUCKET_NAME,
        Key: `test.json`,
        Body: JSON.stringify(req.body), ContentType: "application/json"
      }, 
      function(err,data){
          console.log(JSON.stringify(err)+" "+JSON.stringify(data));
        }
      );
     
      console.log('Upload finished');
      const file = req.files.picture;
      //  console.log(file);
      //  uploadImageToS3(file);
    });
    req.pipe(busboy);
});




//upload an image :)
function uploadImageToS3(file) {
    s3bucket.createBucket(function () {
        var params = {
          Bucket: BUCKET_NAME,
          Key:  `projects/${file.name}`,
          Body: file.data
        };
        s3bucket.upload(params, function (err, data) {
          if (err) {
            console.log('error in callback');
            console.log(err);
          }
          console.log('success');
          console.log(data);
        });
    });
}


//Start the server
let server = app.listen(8080, function () {
    console.log('Touch-table ' + server.address().port);
});




