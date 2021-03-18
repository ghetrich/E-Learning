const mongoose = require("mongoose");

const personalDataSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	title: { type: String, required: true, trim: true },
	name: {
		surname: { type: String, required: true, trim: true },
		othernames: { type: String, required: true, trim: true },
	},
	email: { type: String, required: true, trim: true },
	telephone: { type: String, trim: true },
	hostelRequired: { type: Boolean, default: false },
	dateOfBirth: { type: Date, required: true },
	gender: { type: String, required: true, trim: true },
	placeOfBirth: { type: String, required: true, trim: true },
	nationality: {
		type: String,
		trim: true,
		default: "Ghanaian",
	},
	maritalStatus: { type: String, trim: true, default: "single", enum: ["single","married"]},
	disability: {
		isDisabled: { type: Boolean, default: false },
		whyDisabled: { type: String, trim: true },
	},

	createdAt: { type: Date, default: new Date() },
});

const PersonalData = mongoose.model("personalData", personalDataSchema);

module.exports = PersonalData;
