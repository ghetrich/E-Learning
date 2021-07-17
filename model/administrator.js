const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
	phone: { type: String, required: true, trim: true },
	email: { type: String, required: true, trim: true },
	staffId: { type: String, required: true, trim: true, unique: true },
	createdAt: { type: Date, default: new Date() },
});

const Administrator = mongoose.model("Administrator", adminSchema);

module.exports = Administrator;
