const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
	community: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Community",
		required: true,
	},
	class: [
		{ type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
	],
	question: { type: String, required: true, trim: true, required: true },
	title: { type: String, required: true, trim: true, required: true },
	instructions: { type: String, required: true, trim: true, required: true },
	deadline: { type: Date },
	totalPoints: { type: Number, required: true, trim: true },
	submissions: [
		{
			student: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			],
			submission: {
				type: String,
				required: true,
				trim: true,
				required: true,
			},
			isGraded: { type: Boolean, default: false, trim: true },
			submissionDate: { type: Date, default: new Date() },
			grade: { type: Number, required: true, trim: true },
			markedScript: {
				type: String,
				required: true,
				trim: true,
				required: true,
			},
		},
	],
	createdAt: { type: Date, default: new Date() },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;
