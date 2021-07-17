const Router = require("express").Router();
const uploadContentImage = require("../middleware/upload");

Router.route("/content/image").post(
	uploadContentImage.single("image"),
	async (req, res) => {
		console.log(req.file);

		if (req.file) {
			var filePath = req.file.path;
			return res.status(200).send({status:"OK", path: filePath });
		}
	}
);

module.exports = Router;
