const Clarifai = require('clarifai');
//definining the key and 'app' for clarafai API
const app = new Clarifai.App({
 apiKey: 'aeb07f803bd8491aa02e8dfe658ddc67'
});

//this is where you can pick the API by inserting "FACE_DETECT_MODEL"
const handleApiCall = (req, res) => {
	app.models 
		.predict( Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with API'))
}

const handleImage =  (req, res, db, ) => {
	const { id } = req.body
	db('users').where('id', '=', id ) //using the update function in knex.
  	.increment('entries', 1) //using the increment function in knex.
  	.returning('entries') //returns the values of entries after increment
  	.then(entries => {
  		res.json(entries[0]); //sends the response at [0] because it will only give you a number then and not in a list.
  	})
  	.catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
};