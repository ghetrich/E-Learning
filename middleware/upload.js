const path = require("path");
const multer = require("multer");

var logoStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/images/logos");
	},

	filename: function (req, file, cb) {
		let ext = path.extname(file.originalname);
		let originalname = path.parse(file.originalname).name;
		cb(null, Date.now() + "_" + originalname + ext);
	},
});

var profileStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/images/profiles");
	},

	filename: function (req, file, cb) {
		let ext = path.extname(file.originalname);
		let originalname = path.parse(file.originalname).name;
		cb(null, Date.now() + "_" + originalname + ext);
	},
});

var contentImageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/images/content");
	},

	filename: function (req, file, cb) {
	let ext = path.extname(file.originalname);
	let originalname = path.parse(file.originalname).name;
	cb(null, Date.now() + "_" + originalname + ext);
	},
});

var readingMaterialsStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/materials");
	},

	filename: function (req, file, cb) {
		let ext = path.extname(file.originalname);
		let originalname = path.parse(file.originalname).name;
		cb(null, Date.now() + "_" + originalname + ext);
	},
});

var questionsStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/questions");
	},

	filename: function (req, file, cb) {
		let ext = path.extname(file.originalname);
		let originalname = path.parse(file.originalname).name;
		cb(null, Date.now() + "_" + originalname + ext);
	},
});

var answersStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/answers");
	},

	filename: function (req, file, cb) {
		let ext = path.extname(file.originalname);
		let originalname = path.parse(file.originalname).name;
		cb(null, Date.now() + "_" + originalname + ext);
	},
});




var uploadLogo = multer({
	storage: logoStorage,
	fileFilter: function (req, file, callback) {
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
	},

	limits: {
		fileSize: 1024 * 1024 * 8,
	},
});

var uploadProfile = multer({
	storage: profileStorage,
	fileFilter: function (req, file, callback) {
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
	},

	limits: {
		fileSize: 1024 * 1024 * 8,
	},
});

var uploadContentImage = multer({
	storage: contentImageStorage,
	fileFilter: function (req, file, callback) {
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
	},

	limits: {
		fileSize: 1024 * 1024 * 8,
	},
});

var uploadQuestions = multer({
	storage: questionsStorage,
	fileFilter: function (req, file, callback) {
		if (
			file.mimetype == "application/pdf" ||
			file.mimetype == "application/x-bzip" ||
			file.mimetype == "application/gzip" ||
			file.mimetype == "application/zip" ||
			file.mimetype == "application/x-7z-compressed" ||
			file.mimetype == "application/x-bzip2"
		) {
			callback(null, true);
		} else {
			console.log("file format not supported " + file.mimetype);
			callback(null, false);
		}
	},

	limits: {
		fileSize: 1024 * 1024 * 30,
	},
});

var uploadAnswers = multer({
	storage: answersStorage,
	fileFilter: function (req, file, callback) {
		if (
			file.mimetype == "application/pdf" ||
			file.mimetype == "application/x-freearc" ||
			file.mimetype == "application/x-bzip" ||
			file.mimetype == "application/gzip" ||
			file.mimetype == "application/zip" ||
			file.mimetype == "application/x-7z-compressed" ||
			file.mimetype == "application/x-bzip2"
		) {
			callback(null, true);
		} else {
			console.log("file format not supported " + file.mimetype);
			callback(null, false);
		}
	},

	limits: {
		fileSize: 1024 * 1024 * 30,
	},
});

var uploadMaterials = multer({
	storage: readingMaterialsStorage,
	// fileFilter: function (req, file, callback) {
	// 	if (
	// 		file.mimetype == "image/png" ||
	// 		file.mimetype == "image/jpg" ||
	// 		file.mimetype == "image/jpeg" ||
	// 		file.mimetype == "image/webp"
	// 	) {
	// 		callback(null, true);
	// 	} else {
	// 		console.log("Image format not supported " + file.mimetype);
	// 		callback(null, false);
	// 	}
	// },

	limits: {
		fileSize: 1024 * 1024 * 15,
	},
});
module.exports = uploadAnswers;
module.exports = uploadProfile;
module.exports = uploadLogo;
module.exports = uploadContentImage;
module.exports = uploadMaterials;
module.exports = uploadQuestions;
