const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
function initialize(passport, getUserByEmail, getUserById) {
	const authenticateUser = async (username, password, done) => {
		const user = getUserByEmail(username)
		if (user == null) {
			return done(null, false, { message: "Email or password incorrect" });
        }
        
        console.log(user);

		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			} else {
				return done(null, false, {
					message: "Email or password incorrect",
				});
			}
		} catch (error) {
			return done(error);
		}
	};
	passport.use(
		new localStrategy({ username, password }, authenticateUser)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id, done) => {
		done(null, getUserById(id));
	});
}

module.exports = initialize;
