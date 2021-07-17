const Router = require("express").Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Class = require("../model/class");
const Student = require("../model/student");
const User = require("../model/user");
const uploadProfile = require("../middleware/upload");

Router.route("/new").post(uploadProfile.single("image"), async (req, res) => {
	// console.log(req.user);
	const user = req.user._id

	let image;

	const { name, teacher, track, description, assistants, community } =
		req.body;

	if (!name || !teacher || !track || !description || !community) {
		return res.status(400).send({
			status: "error",
			error: "One or more required fields empty",
		});
	}

	const defaultImage =
		"http://localhost:3000/uploads/images/Profile-Picture.jpg";

	if (req.file) {
		image = req.file.path;
	} else {
		image = defaultImage;
	}

	try {
		const klass = await Class.create({
			name,
			description,
			teacher,
			assistants: assistants,
			image,
			track,
			community,
			createdBy:user
		});
		return res.status(200).send({
			status: "OK",
			msg: "Created",
		});
	} catch (err) {
		console.log(err);
		return res.status(404).send({
			status: "BAD",
			msg: "Unsuccessful 1",
		});
	}
});

Router.route("/edit/banner/:classId").put(
	uploadProfile.single("image"),
	(req, res) => {
		const classId = req.params.classId;
		let image;

		if (req.file) {
			image = req.file.path;
		} else {
			return rs.status(404).send({ status: "BAD", message: "Unsuccessful" });
		}

		Class.findByIdAndUpdate(classId, { $set: { image } })
			.then(done => {
				console.log(done);
				return res.status(200).send({
					status: "OK",
					msg: "Updated",
				});
			})
			.catch(err => {
				console.log(err);
				return res.status(404).send({
					status: "BAD",
					msg: "Unsuccessful",
				});
			});
	}
);
Router.route("/edit/isActive/:classId").put((req, res) => {
	const classId = req.params.classId;
	const { isActive } = req.body;

	const getChanges = () => {
		return isActive ? "Activated" : "Suspended";
	};

	Class.findByIdAndUpdate(classId, { $set: { isActive } })
		.then(done => {
			// console.log(done);
			return res.status(200).send({
				status: "OK",
				msg: getChanges(),
			});
		})
		.catch(err => {
			console.log(err);
			return res.status(404).send({
				status: "BAD",
				msg: "Unsuccessful",
			});
		});
});

Router.route("/edit/:classId").put(async (req, res) => {
	console.log(req.body);
	const classId = req.params.classId;

	const { name, teacher, track, description, assistants } = req.body;

	if (!name || !teacher || !track || !description || !classId) {
		res.status(400).send({
			status: "BAD",
			error: "One or more required fields empty",
		});
	}

	Class.findByIdAndUpdate(classId, {
		$set: {
			name,
			teacher,
			track,
			description,
			assistants,
		},
		// $set: { assistants: { $each: assists } },
	})
		.then(done => {
			console.log(done);
			return res.status(200).send({
				status: "OK",
				msg: "Updated",
			});
		})
		.catch(err => {
			console.log(err);
			return res.status(404).send({
				status: "BAD",
				msg: "Unsuccessful",
			});
		});
});

Router.route("/active").get(async (req, res) => {
	Class.find({ isActive: true })
		.populate("teacher", ["_id", "surname", "othernames", "image"])
		.populate("assistants.user", ["_id", "surname", "othernames", "image"])
		.then(classes => {
			res.status(200).send(classes);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({
				status: "BAD",
				msg: Unsuccessful,
			});
		});
});

Router.route("/").get(async (req, res) => {
	Class.find({})
		.populate("teacher", ["_id", "surname", "othernames", "image"])
		.populate("assistants.user", ["_id", "surname", "othernames", "image"])
		.then(classes => {
			res.status(200).send(classes);
		})
		.catch(err => {
			console.log(err);
			res.status(500).send({
				status: "BAD",
				msg: Unsuccessful,
			});
		});
});
Router.route("/:id").get(async (req, res) => {
	const classId = req.params.id;
	Class.findById(classId)
		.populate("teacher", ["_id", "surname", "othernames", "image"])
		.populate("assistants", ["_id", "surname", "othernames", "image"])
		.populate("studentJoined", ["-password", "-classesJoined"])
		.then(klass => {
			return res.status(200).send(klass);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({
				status: "BAD",
				msg: "Unsuccessful",
			});
		});
});

Router.route("/student/removefromclass/:id").put((req, res) => {
	const { students } = req.body;
	const classId = req.params.id;

	if (
		!students ||
		students.length === 0 ||
		students === undefined ||
		!classId
	) {
		return res.status(406).send({
			status: "BAD",
			msg: " missing fields empty",
		});
	} else {
		
		Class.findByIdAndUpdate(
			classId,
			{
				$pull: { studentJoined: { $in: students } },
			},
			{ multi: true }
		)
			.then(() => {
				return res.status(200).send({
					status: "OK",
					msg: "Done",
				});

			
			})
			.catch(err => {
				console.log(err);
				return res.status(501).send({
					status: "BAD",
					msg: "Something went wrong" + err.message,
				});
				
			});
	}
});

Router.route("/student/addtoclass/:id").put((req, res) => {
	const { students } = req.body;
	const classId = req.params.id;

	console.log(req.body);

	if (
		!students ||
		students.length === 0 ||
		students === undefined ||
		!classId
	) {
		return res.status(406).send({
			status: "BAD",
			msg: " missing fields empty",
		});
	} else {
		Class.findById(classId).then(klass => {
			if (!klass) {
				return res.status(500).send({
					status: "BAD",
					msg: "class not found",
				});
			} else {
				
				Class.findByIdAndUpdate(classId, {
					$addToSet: { studentJoined: { $each: students } },
				})
					.then(() => {
						return res.status(200).send({
							status: "OK",
							msg: "Done",
						});
						
					})
					.catch(err => {
						return res.status(500).send({
							status: "BAD",
							msg: "Something went wrong" + err.message,
						});
					
					});
			}
		});
	
	}
});

module.exports = Router;
