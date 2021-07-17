const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	surname: { type: String, required: true, trim: true },
	othernames: { type: String, required: true, trim: true },
	username: { type: String, required: true, trim: true, unique: true },
	password: { type: String, required: true, trim: true },
	image: { type: String },
	community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
	previlege: {
		type: String,
		required: true,
		enum: [
			"Student",
			"Administrator",
			"Teacher",
			"Systemadministrator",
			"Tutor",
		],
	},
	phone: { type: String, required: true, trim: true },
	email: { type: String, required: true, trim: true, unique: true },
	identification: { type: String, required: true, trim: true },
	classesJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
	classAssisting: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
	isActivated: { type: Boolean, required: true, default: false },
	createdAt: { type: Date, default: new Date() },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
