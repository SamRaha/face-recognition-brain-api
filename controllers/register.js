const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	// a function that checks if the fields have been filled out, if not, the user cannot register.
	if (!email || !name || !password) {
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);
	//the below function sends the login info to the database through a transaction.
	//updating the login table, inserting email and hash into login, then returns the email to use for the login.
	db.transaction(trx => { //creating a transaction when you have to do more than 2 things at once.
		trx.insert({ //use the trx object instead of the db to do the below operations.
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users') //and then using that email address to send it to the users.
			.returning('*') //returns everything back as a resposne
			.insert({
				email: loginEmail[0], // [0] ensures that you respond back in a correct format and not an array.
				name: name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]); //register displays the first user
			})
		})
		.then(trx.commit) // if goes succesfully, send the transactions through.
		.catch(trx.rollback) //incase anything fails, you roll back the changes.
	})
	.catch(err => res.status(400).json('unable to register, user already exists.'))
}

module.exports = {
	handleRegister
};