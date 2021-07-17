const Router = require("express").Router();
const PersonalData = require("../model/personalData");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const bcrypt = require("bcryptjs");

Router.route("/logout").post(ensureAuth,(req, res) => {
	const user = req.user.id;
	const {
		title,
		surname,
		email,
		maritalStatus,
		isDisabled,
		othernames,
		telephone,
		hostelRequired,
		dateOfBirth,
		placeOfBirth,
		nationality,
		gender,
	} = req.body;

	if (
		!title ||
		!surname ||
		!email ||
		!maritalStatus ||
		!isDisabled ||
		!othernames ||
		!telephone ||
		!hostelRequired ||
		!dateOfBirth ||
		!placeOfBirth ||
		!nationality ||
		!gender
    ) {
        
        return

	}
});

module.exports = Router;
