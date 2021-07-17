const Router = require("express").Router();
const Administrator = require("../model/administrator");
const User = require("../model/user");
const uploadProfile = require("../middleware/upload");
const bcrypt = require("bcryptjs");
const Types = require("../Types.json");

Router.route("/new").post(uploadProfile.single("image"), async (req, res) => {
	console.log(req.body);

	let image;
	const { surname, othernames, community, domain, phone, email, id } =
		req.body;

	const defaultImage =
		"http://localhost:3000/uploads/images/Profile-Picture.jpg";
	const password = "password@1";

	if (
		!surname ||
		!othernames ||
		!password ||
		!community ||
		!domain ||
		!id
	) {
		return res
			.status(400)
			.send({ status: "error", error: "All fields are required admin" });
	}

	if (req.file) {
		image = req.file.path;
	} else {
		image = defaultImage;
	}

	const newAdmin = new Administrator({
		phone,
		email,
		staffId:id,
	});

	newAdmin
		.save()
		.then(async admin => {
			const hasdPassword = await bcrypt.hash(password, 10);
			const newUsername = id + "@" + domain;
			const ownerSpecifier = Types.ROLE_ADMIN;
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

				Administrator.findByIdAndDelete(admin._id).then(() => {
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
