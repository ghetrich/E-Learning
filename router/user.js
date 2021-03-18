const Router = require("express").Router();
const User = require("../model/user");
const Student = require("../model/student");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const initialize = require("../passport-config");

// initialize(
// 	passport,
// 	username => {
// 		return username => User.find(user => user.username === username);
// 	},
// 	id => {
// 		return username => User.find(user => user.id === id);
// 	}
// );

const LocalStrategy = require("passport-local").Strategy;

passport.use(
	new LocalStrategy(function (username, password, done) {
		User.findOne({ username: username }, async (err, user) => {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: "Email or password incorrect",
				});
			}

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
		});
	})
);

Router.route("/register").post(async (req, res) => {
	console.log(req.body);
	const { surname, othernames, username, community, previlege } = req.body;
	const googleId = process.env.DEFAULT_GOOGLE_ID || "10345328784796wfwrt144";
	const image = "http://localhost:3000/uploads/images/Profile-Picture.jpg";
	const password = "password@1";

	if (
		!username ||
		!surname ||
		!othernames ||
		!password ||
		!community ||
		!previlege
	) {
		return res
			.status(400)
			.send({ status: "error", error: "All fields are required" });
	}

	if (password.length < 5) {
		return res.status(400).send({
			status: "error",
			error: "Password too short. Should be at least 5 characters",
		});
	}

	const hasdPassword = await bcrypt.hash(password, 10);
	try {
		const response = await User.create({
			surname,
			othernames,
			username,
			password: hasdPassword,
			googleId,
			image,
			community,
			previlege,
		});

		return res.status(200).send({
			status: "OK",
			data: "REGISTERED",
		});
	} catch (error) {
		console.log(error.message);

		if (error.code === 11000) {
			return res
				.status(400)
				.send({ status: "ERROR", error: "Username already in use" });
		}

		throw error;
	}
});

Router.route("/activation").post(async (req, res) => {
	const userId = req.user._id;
	const { password, con_password } = req.body;

	if (!password || !con_password) {
		return res
			.status(400)
			.send({ status: "error", error: "All fields are required" });
	}

	if (password != con_password) {
		return res
			.status(400)
			.send({ status: "error", error: "Password do not match" });
	}

	if (password.length < 8) {
		return res.status(400).send({
			status: "error",
			error: "Password too short. Should be at least 8 characters",
		});
	}

	User.findById(userId).then(async user => {
		try {
			if (await bcrypt.compare(password, user.password)) {
				return res.status(400).send({
					status: "error",
					error: "Password should be different from current password",
				});
			} else {
				const hasdPassword = await bcrypt.hash(password, 10);

				try {
					User.findByIdAndUpdate(userId, {
						$set: { password: hasdPassword, isActivated: true },
					}).then(() => {
						return res.status(200).send({
							status: "OK",
							data: "ACCOUNT ACTIVATED",
						});
					});
				} catch (error) {
					console.log(error);
				}
			}
		} catch (error) {
			console.log(error);
		}
	});
});

Router.route("/login").post(
	passport.authenticate("local", {
		successRedirect: "/control",
		failureRedirect: "/",
		failureFlash: true,
	})
);

Router.route("/all").get(async (req, res) => {
	try {
		User.find()
			.populate("community", ["name", "_id"])
			.select("-password")
			.then(users => {
				return res.status(200).send({
					status: "OK",
					data: users,
				});
			})
			.catch(err => {
				return res.status(400).send({
					status: "BAD",
					data: "SOMETHING WENT WRONG",
				});
			});
	} catch (error) {
		console.log(error);
	}
});

Router.route("/single/:id").get(async (req, res) => {
	const id = req.params.id;

	if (id === undefined || id === null || id === "") {
		return res.status(200).send({
			status: "BAD",
			error: "User does not exist",
		});
	}

	try {
		User.findById(id)
			.populate("community", ["name", "_id"])
			.select("-password")
			.then(user => {
				if (user) {
					return res.status(200).send({
						status: "OK",
						data: user,
					});
				} else {
					return res.status(200).send({
						status: "BAD",
						error: "User does not exist",
					});
				}
			})
			.catch(err => {
				return res.status(400).send({
					status: "BAD",
					data: "SOMETHING WENT WRONG",
				});
			});
	} catch (error) {
		console.log(error);
	}
});

Router.route("/register/student").post(async (req, res) => {
	console.log(req.body);
	const {
		surname,
		othernames,
		community,
		domain,
		phone,
		email,
		studentId,
		classesJoined,
	} = req.body;
	const googleId = process.env.DEFAULT_GOOGLE_ID || "10345328784796wfwrt144";
	const image = "http://localhost:3000/uploads/images/Profile-Picture.jpg";
	const password = "password@1";

	if (
		!surname ||
		!othernames ||
		!password ||
		!community ||
		!domain ||
		!studentId
	) {
		return res
			.status(400)
			.send({ status: "error", error: "All fields are required" });
	}

	Student.find({ studentId }).then(student => {
		if (student.length > 0) {
			return res.status(400).send({
				status: "error",
				error: "A student with ID already exists",
			});
		} else {
			const newStudent = new Student({
				studentId,
				phone,
				email,
				classesJoined,
			});

			newStudent
				.save()
				.then(async student => {
					const hasdPassword = await bcrypt.hash(password, 10);
					const newUsername = studentId + "@" + domain;
					const ownerSpecifier = "Student";
					try {
						const response = await User.create({
							surname,
							othernames,
							username: newUsername,
							password: hasdPassword,
							googleId,
							image,
							community,
							previlege: ownerSpecifier,
							owner: student._id,
							ownerSpecifier,
						});

						return res.status(200).send({
							status: "OK",
							data: "REGISTERED",
						});
					} catch (error) {
						console.log(error.message);

						Student.findByIdAndDelete(student._id).then(() => {
							return res.status(400).send({
								status: "ERROR",
								error: "Something went wrong will creating student",
							});
						})

						throw error;
					}
				})
				.catch(err => {
					return res.status(400).send({
						status: "ERROR",
						error: "Something went wrong will creating student",
					});
				});
		}
	});
});

Router.route("/##").post(async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username }).lean();

	if (!user) {
		return res.json({
			status: "error",
			error: "Invalid username/password",
		});
	}

	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign(
			{ id: user._id, username: user.username },
			JWT_SECRET
		);

		return res.json({
			status: "OK",
			data: token,
		});
	}

	return res.json({ status: "error", error: "Invalid username/password" });
});

module.exports = Router;
