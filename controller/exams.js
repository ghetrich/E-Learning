const express = require("express");
const {
	ensureAuth,
	ensureGuest,
	renderControl,
	onlyFor,
} = require("../middleware/auth");
const axios = require("axios");
const moment = require("moment");
const ROLE = require("../roles");
const CONFIG = require("../configurations");
const INCLUDES = require("../includes");
const TYPES = require("../Types.json");
const app = express();

const renderLayout = (role, nav) => {
	if (nav == "main") {
		if (role == "Administrator") {
			return "admin-navbar";
		} else if (role == "Teacher") {
			return "teacher-navbar";
		}
	} else {
		if (role == "Administrator") {
			return "admin-single-class-navbar";
		} else if (role == "Teacher") {
			return "teacher-single-class-navbar";
		} else if (role == "Student") {
			return "student-navbar";
		}
	}
};

app.get(
	"/class/:classId",
	onlyFor([ROLE.TEACHER, ROLE.ADMIN]),
	async (req, res) => {
		const classId = req.params.classId;
		const community = req.user.community;
		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);
				const exams = await axios.get(`${CONFIG.URI}/exam/class/${classId}`);
			if (!classDetails) {
				res.redirect("/404.ejs");
			} else {
				res.render("../views/pages/class-exams.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
					route: "Assignment",
					classId,
					moment,
					community,
					trunc: INCLUDES.TEXT_TRUNCATION,
                    exams:exams.data || [],
					topics: topics.data || [],
				});
			}
		} catch (error) {
			console.log(error);
			res.end("err");
		}
	}
);
app.get(
	"/:classId/:examId",
	onlyFor([ROLE.TEACHER, ROLE.ADMIN]),
	async (req, res) => {
		const classId = req.params.classId;
		const community = req.user.community;
		const examId = req.params.examId;
		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);
			const exam = await axios.get(`${CONFIG.URI}/exam/${examId}`);
			console.log(exam.data);
			if (!classDetails) {
				res.redirect("/404.ejs");
			} else {
				res.render("../views/pages/class-single-exams.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
					route: "Assignment",
					classId,
					moment,
					community,
					exam: exam.data,
					topics: topics.data || [],
				});
			}
		} catch (error) {
			console.log(error);
			res.end("err");
		}
	}
);

app.get(
	"/class/:classId/new",
	onlyFor([ROLE.TEACHER, ROLE.ADMIN]),
	async (req, res) => {
		const classId = req.params.classId;
		const community = req.user.community;
		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);

			if (!classDetails) {
				res.redirect("/404.ejs");
			} else {
				res.render("../views/pages/class-exams-new.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
					route: "Assignment",
					classId,
					moment,
					community,
					exams: [],
					topics: topics.data || [],
				});
			}
		} catch (error) {
			console.log(error);
			res.end("err");
		}
	}
);

module.exports = app;
