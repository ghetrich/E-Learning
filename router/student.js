const Router = require("express").Router();
const Student = require("../model/student");
const User = require("../model/user");
const Class = require("../model/class");
const uploadProfile = require("../middleware/upload");
const bcrypt = require("bcryptjs");

// Router.route("/all").get((req, res) => {
// 	Student.find()
// 		.then(students => {
// 			return res.status(200).send({ status: "OK", data: students });
// 		})
// 		.catch(error => {
// 			res.status(404).send(error);
// 		});
// });

Router.route("/all").get((req, res) => {
	User.find({ previlege: "student" })
		.populate("owner")
		.select("-password")
		.then(students => {
			return res.status(200).send({ status: "OK", data: students });
		})
		.catch(error => {
			res.status(404).send(error);
		});
});

Router.route("/new").post(uploadProfile.single("image"), async (req, res) => {
	console.log("Request made to me....");
	console.log(req.body);
	console.log(req.files);

	let image;
	const {
		surname,
		othernames,
		community,
		domain,
		phone,
		email,
		id,
		classesJoined,
	} = req.body;
	const defaultImage = "uploads/images/Profile-Picture.jpg";
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

	Student.find({ id })
		.then(async student => {
			if (student.length > 0) {
				return res.status(400).send({
					status: "error",
					error: "A student with ID already exists",
				});
			} else {
				const newStudent = new Student({
					studentId: id,
					phone,
					email,
					classesJoined,
				});

				newStudent
					.save()
					.then(async student => {
						const hashedPassword = await bcrypt.hash(password, 10);
						const newUsername = id + "@" + domain;
						const ownerSpecifier = "Student";

						try {
							const response = await User.create({
								surname,
								othernames,
								username: newUsername,
								password: hashedPassword,
								image,
								community,
								previlege: ownerSpecifier,
								owner: student._id,
								ownerSpecifier,
							});

							return res.status(200).send({
								status: "OK",
								data: response,
							});
						} catch (error) {
							console.log(error.message);

							Student.findByIdAndDelete(student._id).then(() => {
								return res.status(400).send({
									status: "ERROR",
									error: "Something went wrong will creating student 1",
								});
							});

							throw error;
						}
					})
					.catch(err => {
						return res.status(400).send({
							status: "ERROR",
							error: "Something went wrong will creating student 2",
							devErr: err,
						});
					});
			}
		})
		.catch(err => {
			return res.status(400).send({
				status: "ERROR",
				error: "Something went wrong will creating student 3",
				devErr: err,
			});
		});
});

// Router.route("/single/:community").get((req, res) => {
// 	const communityId = req.params.community;

// 	if (communityId === undefined || communityId === "") {
// 		return res
// 			.status(400)
// 			.send({
// 				status: "BAD",
// 				error: "Cannot find community with id" + communityId,
// 			});
// 	}

// 	Community.findById(communityId)
// 		.then(community => {
// 			return res.status(200).send({ status: "OK", data: community });
// 		})
// 		.catch(error => {
// 			res.status(404).send(error);
// 		});
// });

Router.route("/classes/:studentId").get((req, res) => {
	const studentId = req.params.studentId;

	Class.find({
		$and: [{ studentJoined: { $in: [studentId] } }, { isActive: true }],
	})
		.then(classes => {
			return res.status(200).send(classes);
		})
		.catch(err => {
			return res.status(500).send({
				status: "BAD",
				msg: "UNSUCCESSFUL",
			});
		});
});

module.exports = Router;
