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
	"/classes/new",
	onlyFor([ROLE.ADMIN, ROLE.TEACHER]),
	async (req, res) => {
		const community = req.user.community;
		try {
			const teachers = await axios.get(`${CONFIG.URI}/teacher`);

			res.render("../views/pages/class-new.ejs", {
				layout: `./Layouts/${renderLayout(req.user.previlege, "main")}`,
				currentRoute: "Classes",
				tracks: CONFIG.TRACKS || [],
				baseUrl: CONFIG.URI,
				community,
				teachers: teachers.data,
				user: req.user.id,
			});
		} catch (error) {
			console.log(error);
			res.end("err");
		}
	}
);

app.get(
	"/edit/:classId",
	onlyFor([ROLE.ADMIN, ROLE.TEACHER]),
	async (req, res) => {
		const community = req.user.community;
		const classId = req.params.classId;

		try {
			const teachers = await axios.get(`${CONFIG.URI}/teacher`);
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const students = await axios.get(
				`${CONFIG.URI}/user/community/students/${community}`
			);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);

			let assistants = classDetails.data.assistants.map(el => {
				return el._id;
			});

			console.log(assistants);
			res.render("../views/pages/class-edit.ejs", {
				layout: `./Layouts/${renderLayout(req.user.previlege)}`,
				currentRoute: "Classes",
				route: "Overview",
				tracks: CONFIG.TRACKS || [],
				baseUrl: CONFIG.URI,
				community,
				classId,
				assistants,
				previlege: req.user.previlege,
				classDetails: classDetails.data || [],
				students: students.data || [],
				topics: topics.data || [],
				teachers: teachers.data,
			});
		} catch (error) {
			console.log(error);
			res.end("err");
		}
	}
);

app.get(
	"/overview/:id",
	onlyFor([ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT]),
	async (req, res) => {
		const classId = req.params.id;
		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);

			if (!classDetails.data) {
				res.redirect("/admin/class/active");
			} else {
				res.render("../views/pages/single-class.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
					route: "Overview",
					classId,
					moment,
					user: req.user,
					topics: topics.data,
				});
			}
		} catch (error) {
			console.log(error);
			res.end("err");
		}
	}
);

app.get(
	"/topics/:id",
	onlyFor([ROLE.TEACHER, ROLE.ADMIN]),
	async (req, res) => {
		const classId = req.params.id;

		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);

			console.log(classDetails.data);

			if (!classDetails) {
				res.redirect("/404.ejs");
			} else {
				res.render("../views/pages/class-topics.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
					route: "Topics",
					classId,
					moment,
					topics: topics.data || [],
					user: req.user,
				});
			}
		} catch (error) {
			console.log(error);
			res.end("err");
		}
	}
);

app.get(
	"/:classId/topics/edit/:topicId",
	onlyFor([ROLE.ADMIN, ROLE.TEACHER]),
	async (req, res) => {
		const classId = req.params.classId;
		const topicId = req.params.topicId;

		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);
			const topic = await axios.get(`${CONFIG.URI}/topics/${topicId}`);

			if (classDetails.data.status === "BAD") {
				res.redirect("/admin/class/active");
			} else {
				res.render("../views/pages/class-topic-edit.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data || [],
					route: "Topics",
					classId,
					moment,
					topic: topic.data,
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
	"/lessons/:id",
	onlyFor([ROLE.ADMIN, ROLE.TEACHER]),
	async (req, res) => {
		const classId = req.params.id;

		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			// const topics = await axios.get(`${CONFIG.URI}/topics`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);

			if (!classDetails.data) {
				res.redirect("/admin/class/active");
			} else {
				res.render("../views/pages/class-lessons.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data || [],
					route: "Lessons",
					classId,
					moment,
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
	"/:classId/lesson/new/:topicId",
	onlyFor([ROLE.ADMIN, ROLE.TEACHER]),
	async (req, res) => {
		const classId = req.params.classId;
		const topicId = req.params.topicId;

		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);

			if (!classDetails.data) {
				res.redirect("/admin/class/active");
			} else {
				res.render("../views/pages/class-lesson-new.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data || [],
					route: "Lessons",
					classId,
					moment,
					topicId,
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
	"/:classId/topic/:topicId/lesson/:contentId",
	onlyFor([ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT]),
	async (req, res) => {
		const classId = req.params.classId;
		const topicId = req.params.topicId;
		const contentId = req.params.contentId;

		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(`${CONFIG.URI}/topics`);
			const lesson = await axios.get(
				`${CONFIG.URI}/topics/lesson/${topicId}/${contentId}`
			);

			// console.log(lesson.data);

			if (!classDetails.data) {
				res.redirect("/admin/class/active");
			} else {
				res.render("../views/pages/class-single-lesson.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data || [],
					route: "Lessons",
					classId,
					moment,
					topicId,
					contentId,
					topics: topics.data || [],
					lesson: lesson.data,
					user: req.user,
				});
			}
		} catch (error) {
			console.log(error);
			res.end("err");
		}
	}
);

app.get(
	"/:classId/lesson/:topicId/edit/:contentId",
	onlyFor([ROLE.ADMIN, ROLE.TEACHER]),
	async (req, res) => {
		const classId = req.params.classId;
		const topicId = req.params.topicId;
		const contentId = req.params.contentId;
		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);
			const lesson = await axios.get(
				`${CONFIG.URI}/topics/lesson/${topicId}/${contentId}`
			);

			if (!classDetails.data) {
				res.redirect("/admin/class/active");
			} else {
				res.render("../views/pages/class-lesson-edit.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data || [],
					route: "Lessons",
					classId,
					moment,
					topicId,
					contentId,
					lesson: lesson.data,
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
