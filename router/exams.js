const Router = require("express").Router();
const Exam = require("../model/exams");
const uploadQuestions = require("../middleware/upload");
const uploadAnswers = require("../middleware/upload");

Router.route("/new").post(
	uploadQuestions.single("question"),
	async (req, res) => {
		console.log({ user: req.user, body: req.body });
		const {
			totalPoints,
			instructions,
			classId,
			community,
			deadline,
			title
		} = req.body;
		let question;
		if (!instructions || !classId || !totalPoints || !community || !title || !req.user ) {
			return res
				.status(404)
				.send({ status: "BAD", msg: "Unsuccessful! Required fields" });
		}

		if (req.file) {
			question = req.file.path;
		} else {
			return res
				.status(404)
				.send({ status: "BAD", msg: "Please upload the question file" });
		}

		const newQuestion = new Exam({
			instructions,
			class:classId,
			totalPoints,
			community,
			deadline,
			question,
			title,
			createdBy: req.user._id,
		});

		newQuestion
			.save()
			.then(done => {
				console.log(done);
				return res.status(200).send({ status: "OK", msg: "successful",data:done });
			})
			.catch(err => {
				console.log(err);
				return res
					.status(500)
					.send({ status: "BAD", msg: "Unsuccessful! Something went wrong " + err });
			});

		
	}
);

module.exports = Router;
