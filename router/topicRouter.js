const Router = require("express").Router();
const Topic = require("../model/topic");
const User = require("../model/user");
const uploadMaterials = require("../middleware/upload");
const ROLE = require("../roles");
const ObjectId = require("mongoose").ObjectId;

Router.route("/").get((req, res) => {
	Topic.find({})
		.sort({ _id: -1 })
		.then(topics => {
			return res.status(200).send(topics);
		})
		.catch(error => {
			return res.status(406).send({
				status: "BAD",
				msg: "something went wrong",
				devErr: error,
			});
		});
});
Router.route("/:id").get((req, res) => {
	const id = req.params.id;

	Topic.findById(id)
		.select(["title", "introduction", "createdAt"])
		.sort({ createdAt: 1 })
		.then(topic => {
			return res.status(200).send(topic);
		})
		.catch(error => {
			return res.status(406).send({
				status: "BAD",
				msg: "something went wrong",
				devErr: error,
			});
		});
});

Router.route("/class/:id").get((req, res) => {
	const classId = req.params.id;

	Topic.find({ class: classId })
		// .select(["title", "introduction", "createdAt"])
		.sort({ createdAt: 1 })
		.then(topics => {
			return res.status(200).send(topics);
		})
		.catch(error => {
			return res.status(406).send({
				status: "BAD",
				msg: "something went wrong",
				devErr: error,
			});
		});
});

const fetchContent = (contents, id) => {
	let thisContent;

	contents.some(content => {
		if (content._id == id) {
			thisContent = content;
			return true;
		}
	});

	return thisContent;
};
Router.route("/lesson/:topic/:content").get((req, res) => {
	const content = req.params.content;
	const topic = req.params.topic;
	Topic.findById(topic)
		.then(topic => {
			const data = {
				_id: topic._id,
				title: topic.title,
				introduction: topic.introduction,
				createdAt: topic.createdAt,
				lesson: fetchContent(topic.contents, content),
			};

			return res.status(200).send(data);
		})
		.catch(error => {
			return res.status(406).send({
				status: "BAD",
				msg: "something went wrong",
				devErr: error,
			});
		});
});
Router.route("/new/:id").post(async (req, res) => {
	// console.log(req.user);

	const user = req.user._id;
	const { title, introduction } = req.body;
	const classId = req.params.id;

	if (!title || !introduction) {
		return res.status(406).send({
			status: "BAD",
			msg: "Unsuccessful! Required fields not found",
		});
	} else if (!classId) {
		return res.status(201).send({
			status: "BAD",
			msg: "Unsuccessful! class not stated",
		});
	}

	try {
		const topic = await Topic.create({
			class: classId,
			title,
			introduction,
			createdBy: user,
		});

		return res.status(200).send({
			status: "OK",
			msg: "Topic Created",
		});
	} catch (error) {
		console.log(error);
		return res.status(406).send({
			status: "BAD",
			msg: "Unsuccessful! server error",
			devErr: error,
		});
	}
});

Router.route("/edit/:id").put(async (req, res) => {
	// console.log(req.body);

	const { title, introduction } = req.body;
	const topicId = req.params.id;

	if (!title || !introduction) {
		return res.status(406).send({
			status: "BAD",
			msg: "Unsuccessful! Required fields not found",
		});
	} else if (!topicId) {
		return res.status(201).send({
			status: "BAD",
			msg: "Unsuccessful! class not stated",
		});
	}

	Topic.findByIdAndUpdate(topicId, {
		$set: {
			title,
			introduction,
		},
	})
		.then(done => {
			return res.status(200).send({
				status: "OK",
				msg: "Topic Updated",
			});
		})
		.catch(err => {
			console.log(error);
			return res.status(406).send({
				status: "BAD",
				msg: "Unsuccessful! server error",
				devErr: error,
			});
		});
});

Router.route("/delete/:id").put((req, res) => {
	const id = req.params.id;

	Topic.findByIdAndDelete(id)
		.then(() => {
			return res.status(200).send({
				status: "OK",
				msg: "Successful",
			});
		})
		.catch(err => {
			return res.status(406).send({
				status: "BAD",
				msg: "Unsuccessful!",
			});
		});
});

Router.route("/lesson/new/:id").put(
	uploadMaterials.array("readingMaterials", 5),
	async (req, res) => {
		// console.log(req.body);
		const topicId = req.params.id;
		const user = req.user._id;
		// console.log(req.files);
		let readingMaterials;
		const { subTitle, body, reviewQuestion } = req.body;

		if (!subTitle || !body) {
			return res.status(406).send({
				status: "BAD",
				msg: "Unsuccessful! Required fields not found",
			});
		} else if (!topicId) {
			return res.status(201).send({
				status: "BAD",
				msg: "Unsuccessful! class not stated",
			});
		}

		if (req.files) {
			readingMaterials = req.files.map(e => {
				return { path: e.path, originalName: e.originalName, size: e.size };
			});
		}

		const content = {
			subTitle,
			body,
			readingMaterials,
			createdBy: user,
			"review.reviewQuestion": reviewQuestion,
		};

		Topic.findByIdAndUpdate(topicId, { $push: { contents: content } })
			.then(topic => {
				return res.status(200).send({
					status: "OK",
					contents: topic,
				});
			})
			.catch(err => {
				return res.status(406).send({
					status: "BAD",
					msg: "something went wrong",
					devErr: err,
				});
			});
	}
);

Router.route("/delete/:id").delete(async (req, res) => {
	const topicId = req.params.id;

	Topic.findByIdAndDelete(topicId)
		.then(() => {
			return res.status(200).send({ status: "OK" });
		})
		.catch(err => {
			console.log(err);
			return res.status(400).send({ status: "BAD" });
		});
});

Router.route("/:topicId/lesson/delete/:id").delete(async (req, res) => {
	const contentId = req.params.id;
	const topicId = req.params.topicId;

	Topic.findByIdAndUpdate(topicId, {
		$pull: { contents: { _id: contentId } },
	})
		.then(done => {
			console.log(done);
			res.status(200).send({
				status: "OK",
				msg: "Done",
			});
		})
		.catch(err => {
			res.status(400).send({
				status: "BAD",
				msg: "Not deleted",
			});
		});
});

Router.route("/:topicId/lesson/edit/:contentId").put(
	uploadMaterials.array("readingMaterials", 5),
	(req, res) => {
		const topicId = req.params.topicId;
		const contentId = req.params.contentId;
		// console.log(req.body);
		// console.log(req.files);

		let readingMaterials;
		const { subTitle, body, reviewQuestion } = req.body;

		if (!subTitle || !body) {
			return res.status(406).send({
				status: "BAD",
				msg: "Unsuccessful! Required fields not found",
			});
		} else if (!topicId || !contentId) {
			return res.status(201).send({
				status: "BAD",
				msg: "Unsuccessful! class not stated",
			});
		}

		if (req.files) {
			readingMaterials = req.files.map(e => {
				return { path: e.path, originalName: e.originalname, size: e.size};
			});
		}

		const content = {
			subTitle,
			body,
			readingMaterials,
			"review.reviewQuestion": reviewQuestion,
		};

		Topic.updateOne(
			{
				_id: topicId,
				"contents._id": contentId,
			},
			{
				$set: {
					"contents.$.subTitle": content.subTitle,
					"contents.$.body": body,
					"contents.$.review.reviewQuestion": reviewQuestion,
				},
				$push: { "contents.$.readingMaterials": readingMaterials },
			}
		)
			.then(topic => {
				return res.status(200).send({
					status: "OK",
					contents: topic,
				});
			})
			.catch(err => {
				return res.status(406).send({
					status: "BAD",
					msg: "something went wrong",
					devErr: err,
				});
			});
	}
);

module.exports = Router;
