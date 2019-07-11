const express = require('express'); //importing express
const bcrypt = require('bcrypt-nodejs')
const bodyParser = require('body-parser'); //so we can identify what is in the body.
const cors = require('cors'); // to bypass google chrome's access control allow orogin. a middleware that allows you to bypass the security error with google. trying to communicate with the world with http, but it doesn't trust that our server is secure.
const knex = require('knex') //a library that allows you to connect your database to your front-end

//importing the function files
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '1234',
    database : 'smartbrain'
  }
});


const app = express(); //d efining that app = the express library

app.use(bodyParser.json()); //defining the app that it uses body-parser
app.use(cors()); //initialising app to use cors.


// the root app gets your he database of the users
app.get('/', (req, res)=> {
	res.send(database.users); //everytime you change this get request res.send(), it resets nodemon and you lose your live database on postman. this is why you use actual databases.
}) //passing a get function to send a response that says "this is working"


//signin - json works better than send in this case (we receive a json string)
//always send sensitive information from front end to back end using HTTPS with a POST body, and generate a hash to store in the database.
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })


//register grab the boy and enter it to the database . we can use the push function
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) //dependancy injection. injecting all the dependencies that the register function needs.
 
//profileId (we add the let found = false because if it finds it once, then the loop stops. so you want to add a re-loop if it's not foind)
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

//entries count for image, update the user to increase their entries count.
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(3000, ()=> {
	console.log('app is running on port 3000');
}) //passing the port to listen at port 3000, then console logging it on node (shell) that 'app is running on port 3000.'



/* 
/ --> res = this is working.... meaning:  a root route "/" that sesponds with this is working. 
/singing --> POST = sucess/fail a sing in that will be a post request that respond with either success or fail.
/register --> POST = user... meaning: sending a post request that send back the user object that was just created.
/profile/:userId --> GET = user ... meaining: have the ability to have access to the profile. so a GET request that gets ther userId information
/image --> PUT --> user meaning: because we want to work with ranking, their count for how many submitted goes up. a variable would keep the score and checks against other users to give them a rank 
*/