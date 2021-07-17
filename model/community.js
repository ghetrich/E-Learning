const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true, uppercase: true },
	address: {
		telephone: [{ type: String, required: true, trim: true }],
		region: { type: String, required: true, trim: true },
		city: { type: String, required: true, trim: true },
	},
	domain: { type: String, required: true, trim: true, lowercase: true },
	officialMail: { type: String, required: true, trim: true },
	alias: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		uppercase: true,
	},
	slogan: { type: String, required: true, trim: true },
	logo: { type: String },
	classes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class",
		},
	],
	createdAt: { type: Date, default: new Date() },
	modifications: [
		{
			modifiedAt: { type: Date, default: new Date() },
			modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
		},
	],
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
