const handleProfile =  (req, res, db, ) => {
	const { id } = req.params;
	db.select('*').from('users').where({id}) //ES6 fixture where id and value are the same. instead of typing id:id
	.then(user => {
		if (user.length) { //if the user has any length.. i.e. it exists, return the below:
			res.json(user[0]) //this sends the the response to the body in postman.
		} else {
			res.status(400).json('not found') //error message when an id that doesn't exist is entered.
		}
	})	
	.catch(err => res.status(400).json('error getting user'))
}

module.exports = {
	handleProfile
};