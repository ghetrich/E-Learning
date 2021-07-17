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
	"/class/:classId/announcements",
	onlyFor([ROLE.TEACHER, ROLE.ADMIN]),
	async (req, res) => {
		const classId = req.params.classId;
		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);
			const announcements = await axios.get(
				`${CONFIG.URI}/announcement/class/${classId}`
			);
			if (!classDetails) {
				res.redirect("/404.ejs");
			} else {
				const read = (data, id) => {
					let findings = false;
					data.some(el => {
						if (el === id.toString()) {
							findings = true;
							return true;
						}
					});

					return findings;
				};

				// console.log(read);
				res.render("../views/pages/class-announcements.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
					route: "Announcement",
					classId,
					moment,
					read,
					user: req.user,
					trunc: INCLUDES.TEXT_TRUNCATION,
					announcements: announcements.data,
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
	"/class/:classId/announcement/:id",
	onlyFor([ROLE.TEACHER, ROLE.ADMIN, ROLE.STUDENT]),
	async (req, res) => {
		const { classId, id } = req.params;

		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);
			const announcement = await axios.get(
				`${CONFIG.URI}/announcement/${id}`
			);
			if (!classDetails) {
				res.redirect("/404.ejs");
			} else {
				res.render("../views/pages/single-announcement.ejs", {
					layout: `./Layouts/${renderLayout(req.user.previlege)}`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
					route: "Announcement",
					classId,
					moment,

					user: req.user,
					trunc: INCLUDES.TEXT_TRUNCATION,
					announcement: announcement.data,
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
	"/class/:classId/announcement-new",
	onlyFor([ROLE.TEACHER, ROLE.ADMIN]),
	async (req, res) => {
		const classId = req.params.classId;
		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);

			if (!classDetails) {
				res.redirect("/404.ejs");
			} else {
				res.render("../views/pages/class-announcement-new.ejs", {
					layout: "./Layouts/teacher-single-class-navbar",
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
					route: "Announcement",
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



module.exports = app;