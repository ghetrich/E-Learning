const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
	phone: { type: String, required: true, trim: true },
	email: { type: String, required: true, trim: true, unique: true },
	studentId: { type: String, required: true, trim: true },
	classesJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
	createdAt: { type: Date, default: new Date() },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
