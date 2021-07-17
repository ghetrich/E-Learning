const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
	isSuspended: { type: Boolean, default: false },
	class: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Class",
		required: true,
	},
	title: { type: String, required: true, trim: true },
	introduction: { type: String, required: true },
	contents: [
		{
			isSuspended: { type: Boolean, default: false },
			subTitle: { type: String, trim: true, required: true },
			body: { type: String, trim: true, required: true },

			readingMaterials: [
				{
					path: { type: String, trim: true },
					originalName: { type: String, trim: true },
					size: { type: String, trim: true },
					createdAt: { type: Date, default: new Date() },
				},
			],
			review: {
				reviewQuestion: { type: String, trim: true },
				reviewList: [
					{
						user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
						reviewNote: { type: String, trim: true },
						comment: { type: String, trim: true },
						needsAttention: { type: Boolean, default: false },
						reviewedAt: { type: Date, default: new Date() },
					},
				],
			},
			createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			createdAt: { type: Date, default: new Date() },
		},
	],

	createdAt: { type: Date, default: new Date() },
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
