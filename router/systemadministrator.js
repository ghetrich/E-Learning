const Router = require("express").Router();
const Systemadministrator = require("../model/systemadministrator");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const Type = require("../Types.json");


Router.route("/new").post(async (req, res) => {
	console.log(req.body);
	const {
		surname,
		othernames,
		community,
		domain,
		phone,
		email,
		username,
	} = req.body;

	const image = "http://localhost:3000/uploads/images/Profile-Picture.jpg";
	const password = "password@1";

	if (
		!surname ||
		!othernames ||
		!password ||
		!community ||
		!domain ||
		!username
	) {
		return res
			.status(400)
			.send({ status: "error", error: "All fields are required" });
	}

	const newSystemadmin = new Systemadministrator({
		phone,
        email,
        username
	});

	newSystemadmin
		.save()
        .then(async admin => {
               
			const hasdPassword = await bcrypt.hash(password, 10);
			const newUsername = username + "@" + domain;
			const ownerSpecifier = Types.ROLE_SYSTEM_ADMIN
			try {
				const response = await User.create({
					surname,
					othernames,
					username: newUsername,
					password: hasdPassword,
					image,
					community,
					previlege: ownerSpecifier,
					owner: admin._id,
					ownerSpecifier,
				});

				return res.status(200).send({
					status: "OK",
					data: "REGISTERED",
				});
			} catch (error) {
				console.log(error.message);

				Systemadministrator.findByIdAndDelete(admin._id).then(() => {
					return res.status(400).send({
						status: "ERROR",
						error: "Something went wrong will creating Admin",
					});
				});

				
			}
		})
		.catch(err => {
			return res.status(400).send({
				status: "ERROR",
				error: err,
			});
		});
});

module.exports = Router;
