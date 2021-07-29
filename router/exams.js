const Router = require("express").Router();
const Exam = require("../model/exams");
const uploadQuestions = require("../middleware/upload");
const uploadAnswers = require("../middleware/upload");

Router.route("/new/:classId").post(
	uploadQuestions.single("question"),
	async (req, res) => {
		console.log({ user: req.user, body: req.body });
		const classId = req.params.classId;
		const { totalPoints, instructions, community, startsAt, endsAt, title } =
			req.body;
		let question;

		if (
			!instructions ||
			!totalPoints ||
			!community ||
			!title ||
			!req.user ||
			!startsAt ||
			!endsAt
		) {
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

		if (startsAt > endsAt) {
			return res.status(404).send({ status: "BAD", msg: "Duration Error" });
		}

		const newQuestion = new Exam({
			instructions,
			class: classId,
			totalPoints,
			community,
			startsAt,
			endsAt,
			question,
			title,
			createdBy: req.user._id,
		});

		newQuestion
			.save()
			.then(done => {
				console.log(done);
				return res
					.status(200)
					.send({ status: "OK", msg: "successful", data: done });
			})
			.catch(err => {
				console.log(err);
				return res.status(500).send({
					status: "BAD",
					msg: "Unsuccessful! Something went wrong " + err,
				});
			});
	}
);

Router.route("/submissions/:examId").put(
	uploadAnswers.single("submission"),
	(req, res) => {
		const student = req.user._id;
		// const student = req.user;
		const examId = req.params.examId;
		let submission;

		if (!examId) {
			return res
				.status(404)
				.send({ status: "BAD", msg: "Unsuccessful! Required fields" });
		}

		if (req.file) {
			submission = req.file.path;
		} else {
			return res
				.status(404)
				.send({ status: "BAD", msg: "Please upload the question file" });
		}

		Exam.findByIdAndUpdate(examId, {
			$push: { submissions: { student, submission } },
		})
			.then(done => {
				console.log(done);
				return res.status(200).send({
					status: "OK",
					msg: "successful ",
				});
			})
			.catch(err => {
				console.log(err);
				return res.status(500).send({
					status: "BAD",
					msg: "Unsuccessful! Something went wrong " + err,
				});
			});
	}
);
Router.route("/submissions/change/:examId").put(
	uploadAnswers.single("submission"),
	(req, res) => {
		const student = req.user._id;
		const { submissionId } = req.body;
		const examId = req.params.examId;
		let submission;

		if (!examId) {
			return res
				.status(404)
				.send({ status: "BAD", msg: "Unsuccessful! Required fields" });
		}

		if (req.file) {
			submission = req.file.path;
		} else {
			return res
				.status(404)
				.send({ status: "BAD", msg: "Please upload the question file" });
		}

		Exam.updateOne(
			{ _id: examId, "submissions._id": submissionId },
			{
				$set: {
					"submissions.$.submission": submission,
					"submissions.$.submissionDate": new Date(),
				},
			}
		)
			.then(done => {
				console.log(done);
				return res.status(200).send({
					status: "OK",
					msg: "successful ",
				});
			})
			.catch(err => {
				console.log(err);
				return res.status(500).send({
					status: "BAD",
					msg: "Unsuccessful! Something went wrong " + err,
				});
			});
	}
);

Router.route("/class/:classId").get((req, res) => {
	const classId = req.params.classId;
	Exam.find({ class: classId })
		.sort({ createdAt: "DESC" })
		.then(exams => {
			return res.status(200).send(exams);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({
				status: "BAD",
				msg: "Unsuccessful! Something went wrong " + err,
			});
		});
});

Router.route("/:examId").get((req, res) => {
	const examId = req.params.examId;
	Exam.findById(examId)
		.populate({
			path: "submissions",
			populate: {
				path: "student",
				select: ["_id", "surname", "othernames", "identification"],
			},
		})
		.then(exam => {
			return res.status(200).send(exam);
		})
		.catch(err => {
			console.log(err);
			return res.status(500).send({
				status: "BAD",
				msg: "Unsuccessful! Something went wrong " + err,
			});
		});
});

Router.route("/:examId/grade/:studentId").put(
	uploadAnswers.single("markedScript"),
	(req, res) => {
		const { grade } = req.body;
		let markedScript;
		const studentId = req.params.studentId;
		const examId = req.params.examId;
		if (!grade) {
			return res
				.status(404)
				.send({ status: "BAD", msg: "Unsuccessful! Required fields" });
		}
		// console.log(req.file);
		// console.log(req.body);
		let pushScript = {};
		if (req.file) {
			markedScript = req.file.path;
			pushScript = {
				"submissions.$.markedScript": {
					script: markedScript,
					submittedBy: req.user.id,
				},
			};
		}

		Exam.updateOne(
			{ _id: examId, "submissions._id": studentId },
			{
				$set: {
					"submissions.$.isGraded": true,
					"submissions.$.grade": grade,
					"submissions.$.modifiedBy": req.user.id,
				},
				$push: pushScript,
			}
		)
			.then(done => {
				console.log(done);
				return res.status(200).send({ status: "OK", msg: done });
			})
			.catch(err => {
				console.log(err);
				return res
					.status(500)
					.send({ status: "BAD", msg: "Server error: " + err });
			});
	}
);

Router.route("/class/:classId/assignments").get((req, res) => {
	const classId = req.params.classId;

	Exam.find({ class: classId })
		.then(assignments => {
			return res.status(200).send(assignments);
		})
		.catch(err => {
			console.log(err);
			return res
				.status(500)
				.send({ status: "BAD", msg: "Server error: " + err });
		});
});

module.exports = Router;
