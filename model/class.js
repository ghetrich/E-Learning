const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true, uppercase: true },
	description: { type: String, required: true, trim: true },
	track: { type: String, required: true, trim: true },
	image: { type: String },
	community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	assistants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	studentJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	isActive: { type: Boolean, default: true },
	createdAt: { type: Date, default: new Date() },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
	modifications: [
		{
			modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			modifiedAt: { type: Date, default: new Date() },
		},
	],
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;

// const lessonSchema = new mongoose.Schema({
// 	class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
// 	topic: { type: String, trim: true, uppercase: true, required: true },
// 	introduction: { type: String, trim: true, required: true },
// 	body: [{ type: String, trim: true }],
// 	videoLinks: [{ type: String, trim: true }],
// 	imageLinks: [{ type: String, trim: true }],
// 	otherLinks: [{ type: String, trim: true }],
// 	readingMaterials: [{ type: String, trim: true }],
// 	createdAt: { type: Date, default: new Date() },
// 	modifications: [
// 		{
// 			modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// 			modifiedAt: { type: Date, default: new Date() },
// 		},
// 	],
// });

// const Lesson = mongoose.model("Lesson", lessonSchema);
// module.exports = Lesson;
