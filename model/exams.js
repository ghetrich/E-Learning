const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
	community: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Community",
		required: true,
	},
	class: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Class",
		required: true,
	},
	question: { type: String, trim: true, required: true },
	markingScheme: { type: String, trim: true },
	title: { type: String, trim: true, required: true },
	instructions: { type: String, trim: true, required: true },
	startsAt: { type: Date },
	endsAt: { type: Date },
	totalPoints: { type: Number, required: true, trim: true },
	submissions: [
		{
			student: 
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			
			submission: {
				type: String,
				required: true,
				trim: true,
				required: true,
			},
			isGraded: { type: Boolean, default: false, trim: true },
			submissionDate: { type: Date, default: new Date() },
			grade: { type: Number, trim: true, default: 0 },
			mordifiedBy:{type:mongoose.Schema.Types.ObjectId, ref: "User"},
			markedScript: [
				{
					script: {
						type: String,

						trim: true,
					},
					submittedBy: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "User",
					},
				},
			],
		},
	],
	createdAt: { type: Date, default: new Date() },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Exam = mongoose.model("Exam", examSchema);
module.exports = Exam;
