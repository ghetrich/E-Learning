const Router = require("express").Router();
const Announcement = require("../model/announcement");
const Class = require("../model/class");

Router.route("/class/:classId/new").post((req, res) => {
	const { header, message } = req.body;
	const { community, _id: userId } = req.user;
	const classId = req.params.classId;

	console.log({ header, message, community, userId, classId });

	const img = "http://localhost:3000/uploads/announcement-1.jpg";

	if (!message || !header || !community || !userId) {
		return res
			.status(404)
			.send({ status: "BAD", msg: "Unsuccessful! Required fields" });
	}

	Class.findById(classId)
		.then(clas => {
			let tar = clas.studentJoined;

			const newAnnouncement = new Announcement({
				message,
				header,
				target: tar,
				community,
				class: classId,
				createdBy: userId,
				image: img,
			});

			newAnnouncement
				.save()
				.then(done => {
					console.log(done);

					return res.status(200).send({ status: "OK", msg: "successful" });
				})
				.catch(err => {
					console.log(err);
					return res.status(500).send({
						status: "BAD",
						msg: "Unsuccessful!",
					});
				});
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({
				status: "BAD",
				msg: "Something went wrong",
			});
		});
});

Router.route("/class/:classId").get((req, res) => {
	const classId = req.params.classId;

	Announcement.find({ class: classId })
		.sort({ createdAt: "desc" })
		.then(info => {
			// console.log(info);
			return res.status(200).send(info);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ status: "BAD", msg: "Unsuccessful" });
		});
});

Router.route("/student/:id").get((req, res) => {
	const Id = req.params.id;


	Announcement.find({ target: { $in: [Id] } })
		.populate("class", "image")
		.populate("createdBy", ["_id", "surname", "othernames", "image"])
		.sort({ createdAt: "desc" })
		.then(info => {
			// console.log(info);
			return res.status(200).send(info);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ status: "BAD", msg: "Unsuccessful" });
		});
});

Router.route("/admin").get((req, res) => {
	const community = req.user.community;

	Announcement.find({ community })
		.populate("class", "image")
		.populate("createdBy", ["_id", "surname", "othernames", "image"])
		.sort({ createdAt: "desc" })
		.then(info => {
			// console.log(info);
			return res.status(200).send(info);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ status: "BAD", msg: "Unsuccessful" });
		});
});

Router.route("/:id").get((req, res) => {
	const id = req.params.id;

	Announcement.findById(id)
		.populate("class", "image")
		.populate("createdBy", ["_id", "surname", "othernames", "image"])
		.then(info => {
			console.log(info);
			return res.status(200).send(info);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ status: "BAD", msg: "Unsuccessful" });
		});
});

Router.route("/:id").put((req, res) => {
	const id = req.params.id;
	const userId = req.user._id;

	Announcement.findByIdAndUpdate(id, {
		$addToSet: { read: userId },
	})
		.then(done => {
			console.log(done);
			return res.status(200).send({ status: "OK", msg: "successful" });
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ status: "BAD", msg: "Unsuccessful" });
		});
});

Router.route("/delete/:id").delete((req, res) => {
	const id = req.params.id;

	Announcement.findByIdAndDelete(id)
		.then(done => {
			console.log(done);
			return res.status(200).send({ status: "OK", msg: "successful" });
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({ status: "BAD", msg: "Unsuccessful" });
		});
});

module.exports = Router;
