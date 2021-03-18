// const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.fieldname === "logo") {
			cb(null, "uploads/images");
		}
	},

	filename: function (req, file, cb) {
		let ext = path.extname(file.originalname);
		cb(null, Date.now() + ext);
	},
});

var upload = multer({
	storage: storage,
	fileFilter: function (req, file, callback) {
		if (file.fieldname === "logo") {
			if (
				file.mimetype == "image/png" ||
				file.mimetype == "image/jpg" ||
				file.mimetype == "image/jpeg" ||
				file.mimetype == "image/webp"
			) {
				callback(null, true);
			} else {
				console.log("Image format not supported " + file.mimetype);
				callback(null, false);
			}
		}
	},

	limits: {
		fileSize: 1024 * 1024 * 8,
	},
});

module.exports = upload;
