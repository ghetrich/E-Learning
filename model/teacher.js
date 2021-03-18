const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
	phone: { type: String, required: true, trim: true },
	email: { type: String, required: true, trim: true, unique: true },
	staffId: { type: String, required: true, trim: true },
	image: { type: String },
	community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
	classesJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
	createdAt: { type: Date, default: new Date() },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
