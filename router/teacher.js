const Router = require("express").Router();
const Teacher = require("../model/teacher");
const User = require("../model/user");
const Class = require("../model/class");
const uploadProfile = require("../middleware/upload");
const bcrypt = require("bcryptjs");
const Types = require("../Types.json");
const ROLE = require("../roles");

Router.route("/").get(async (req, res) => {
	User.find({ previlege: ROLE.TEACHER })
		.then(teachers => {
			const refinedList = teachers.map(teacher => {
				return {
					id: teacher._id,
					name: teacher.othernames + " " + teacher.surname,
				};
			});
			res.status(200).send(refinedList);
		})
		.catch(err => {
			console.log(err);
		});
});

Router.route("/new").post(uploadProfile.single("image"), async (req, res) => {
	// console.log(req.body);

	let image;
	const { surname, othernames, community, domain, phone, email, id } =
		req.body;

	const defaultImage =
		"http://localhost:3000/uploads/images/Profile-Picture.jpg";
	const password = "password@1";

	if (!surname || !othernames || !password || !community || !domain || !id) {
		return res
			.status(400)
			.send({ status: "error", error: "All fields are required" });
	}

	if (req.file) {
		image = req.file.path;
	} else {
		image = defaultImage;
	}

	const newTeacher = new Teacher({
		phone,
		email,
		staffId: id,
	});

	Teacher.find({ id })
		.then(staff => {
			if (staff.length > 0) {
				return res
					.status(400)
					.send({ status: "error", error: "Another user has this ID" });
			}

			newTeacher
				.save()
				.then(async teacher => {
					const hasdPassword = await bcrypt.hash(password, 10);
					const newUsername = id + "@" + domain;
					const ownerSpecifier = ROLE.TEACHER;
					try {
						const response = await User.create({
							surname,
							othernames,
							username: newUsername,
							password: hasdPassword,
							image,
							community,
							previlege: ownerSpecifier,
							owner: teacher._id,
							ownerSpecifier,
						});

						return res.status(200).send({
							status: "OK",
							data: "REGISTERED",
						});
					} catch (error) {
						console.log(error.message);

						Teacher.findByIdAndDelete(teacher._id).then(() => {
							return res.status(400).send({
								status: "ERROR",
								error: "Something went wrong will creating Admin",
							});
						});
					}
				})
				.catch(err => {
					return res.status(400).send({
						status: "ERROR",
						error: err,
					});
				});
		})
		.catch(err => {
			return res.status(400).send({
				status: "ERROR",
				error: err,
			});
		});
});

Router.route("/classes/:teacherId").get((req, res) => {
	const teacher = req.params.teacherId;

	Class.find({ $and: [{ teacher }, { isActive: true }] })
		// .populate(["studentJoined", "assistants"])
		.then(teacher => {
			return res.status(200).send(teacher);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ status: "BAD", msg: "Unsuccessful" });
		});
});

Router.route("/classes/assisting/:teacherId").get((req, res) => {
	const teacher = req.params.teacherId;

	Class.find({
		$and: [{ assistants: { $in: [teacher] } }, { isActive: true }],
	})
		// .populate(["studentJoined", "assistants"])
		.then(teacher => {
			return res.status(200).send(teacher);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ status: "BAD", msg: "Unsuccessful" });
		});
});

Router.route("/classes/:filter/:teacherId").get((req, res) => {
	const teacher = req.params.teacherId;
	const filter = req.params.filter;

	let QUERY = {};

	if (filter == "suspended") {
		QUERY = {
			$and: [
				{ isActive: false },
				{ $or: [{ teacher }, { assistants: { $in: [teacher] } }] },
			],
		};
	} else if (filter == "main") {
		QUERY = { $and: [{ teacher }, { isActive: true }] };
	} else if (filter == "assisting") {
		QUERY = {
			$and: [{ assistants: { $in: [teacher] } }, { isActive: true }],
		};
	}

	Class.find(QUERY)
		// .populate(["studentJoined", "assistants"])
		.then(teacher => {
			return res.status(200).send(teacher);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ status: "BAD", msg: "Unsuccessful" });
		});
});

module.exports = Router;
