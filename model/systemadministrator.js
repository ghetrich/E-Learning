const mongoose = require("mongoose");

const systemAdminSchema = new mongoose.Schema({
	phone: { type: String, required: true, trim: true },
	email: { type: String, required: true, trim: true,},
	username: { type: String, required: true, trim: true, unique: true },
	createdAt: { type: Date, default: new Date() },
});

const Systemadministrator = mongoose.model(
	"Systemadministrator",
	systemAdminSchema
);

module.exports = Systemadministrator;
