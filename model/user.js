const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	surname: { type: String, required: true, trim: true },
	othernames: { type: String, required: true, trim: true },
	username: { type: String, required: true, trim: true, unique: true },
	password: { type: String, required: true, trim: true },
	googleId: { type: String, required: true, trim: true },
	image: { type: String },
	community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
	previlege: {
		type: String,
		required: true,
		lowercase: true,
		enum: ["student", "administrator", "teacher", "systemadministrator"],
	},
	owner: { type: mongoose.Schema.Types.ObjectId, refPath: "ownerSpecifier" },
	ownerSpecifier: {
		type: String,
		required: true,
		trim: true,
		enum: [
			"Student",
			"Administrator",
			"Teacher",
			"Superadministrator",
			"Tutor",
		],
	},
	isActivated: { type: Boolean, required: true, default: false },
	createdAt: { type: Date, default: new Date() },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
