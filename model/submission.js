const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
	exams: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Exam",
		required: true,
	},

	student: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	],
	submission: { type: String, required: true, trim: true, required: true },
	isGraded: { type: Boolean, default: false, trim: true },
	submissionDate: { type: Date, default: new Date() },
	grade: { type: Number, required: true, trim: true },
	markedScript: { type: String, required: true, trim: true, required: true },
});

const Submission = mongoose.model("Submission ", submissionSchema);
module.exports = Submission ;
