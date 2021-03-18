const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
	Name: { type: String, required: true, trim: true, uppercase: true },
	image: { type: String },
	community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
	Instructor: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
	tAJoined: [
		{
			id: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
			dateJoined: { type: Date, default: new Date() },
		},
	],
	studentJoined: [
		{
			id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
			dateJoined: { type: Date, default: new Date() },
		},
	],
	lesson: [
		{
			topic: { type: String, trim: true, uppercase: true },
			introduction: { type: String, trim: true },
			paragraphs: [{ type: String, trim: true }],
			videoLinks: [{ type: String, trim: true }],
			imageLinks: [{ type: String, trim: true }],
            otherLinks: [{ type: String, trim: true }],
            dateAdded:{type:Date, default: new Date()}
		},
	],
	isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: new Date() },
    modifications: [
        {
            modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            modifiedAt:{type: Date, default: new Date()}
        }
    ]
   
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
