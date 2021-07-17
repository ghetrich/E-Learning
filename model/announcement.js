const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
	isForAll: { type: Boolean, default: false },
	target: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
	community: { type: mongoose.Schema.Types.ObjectId, ref: "community" },
	header: { type: String, required: true, trim: true },
	image: { type: String },
	message: { type: String, required: true, trim: true },
	read: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: Date.now() },
});

const Announcement = mongoose.model("Announcement", AnnouncementSchema);
module.exports = Announcement;
