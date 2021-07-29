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

app.get("/classes", onlyFor([ROLE.STUDENT]), async (req, res) => {
	const student = req.user.id;
	try {
		const classDetails = await axios.get(
			`${CONFIG.URI}/student-route/classes/${student}`
		);

		if (!classDetails) {
			res.redirect("/404.ejs");
		} else {
			res.render("../views/pages/student-classes.ejs", {
				layout: "./Layouts/student-navbar",
				currentRoute: "Classes",
				baseUrl: CONFIG.URI,
				classDetails: classDetails.data,
				moment,
			});
		}
	} catch (error) {
		console.log(error);
		res.end("err");
	}
});

app.get("/topics/:classId", onlyFor([ROLE.STUDENT]), async (req, res) => {
	const student = req.user.id;
	const classId = req.params.classId;
	try {
		const topics = await axios.get(`${CONFIG.URI}/topics/class/${classId}`);
		const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);

		if (!classDetails) {
			res.redirect("/404.ejs");
		} else {
			const mates = classDetails.data.studentJoined.filter(
				student => student._id != req.user._id
			);

			res.render("../views/pages/student-class-topics.ejs", {
				layout: "./Layouts/student-navbar",
				currentRoute: "Classes",
				baseUrl: CONFIG.URI,
				classDetails: classDetails.data,
				moment,
				classId,
				mates,
				me: req.user,
				topics: topics.data || [],
			});
		}
	} catch (error) {
		console.log(error);
		res.end("err");
	}
});

app.get(
	"/:classId/topic/:topicId/lesson/:contentId",
	onlyFor([ROLE.STUDENT]),
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

			if (!classDetails.data || !lesson) {
				res.redirect("/admin/class/active");
			} else {
				res.render("../views/pages/student-single-lesson.ejs", {
					layout: `./Layouts/student-navbar`,
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data || [],
					classId,
					moment,
					topicId,
					contentId,
					filetype: INCLUDES.FILE_TYPES,
					fileSize: INCLUDES.FILE_SIZE,
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
	"/:classId/announcements",
	onlyFor([ROLE.STUDENT]),
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
				res.render("../views/pages/student-announcements.ejs", {
					layout: "./Layouts/student-navbar",
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
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
	"/:classId/announcement/:id",
	onlyFor([ROLE.STUDENT]),
	async (req, res) => {
		const classId = req.params.classId;
		const announcementId = req.params.id;
		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);
			const announcement = await axios.get(
				`${CONFIG.URI}/announcement/${announcementId}`
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
				res.render("../views/pages/student-single-announcement.ejs", {
					layout: "./Layouts/student-navbar",
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
					classId,
					moment,
					read,
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

app.get("/:classId/assignments", onlyFor([ROLE.STUDENT]), async (req, res) => {
	const classId = req.params.classId;
	try {
		const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
		const topics = await axios.get(`${CONFIG.URI}/topics/class/${classId}`);
		const assignments = await axios.get(
			`${CONFIG.URI}/exam/class/${classId}`
		);

		const checkIfSubmitted = (submissions, id) => {
			let findings;
			submissions.some(el => {
					if (el.student == id) {
						findings = el
						return true;
					}
			});
			
			return findings;
		}

		if (!classDetails) {
			res.redirect("/404.ejs");
		} else {
		
			
			res.render("../views/pages/student-assignments.ejs", {
				layout: "./Layouts/student-navbar",
				currentRoute: "Classes",
				baseUrl: CONFIG.URI,
				classDetails: classDetails.data,
				classId,
				moment,
				checkIfSubmitted,
				trunc: INCLUDES.TEXT_TRUNCATION,
				user: req.user,
				assignments: assignments.data,
				topics: topics.data || [],
			});
		}
	} catch (error) {
		console.log(error);
		res.end("err");
	}
});

app.get(
	"/submission/:classId/:assignmentId",
	onlyFor([ROLE.STUDENT]),
	async (req, res) => {
		const classId = req.params.classId;
		const assignmentId = req.params.assignmentId;
		try {
			const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
			const topics = await axios.get(
				`${CONFIG.URI}/topics/class/${classId}`
			);
			const assignment = await axios.get(
				`${CONFIG.URI}/exam/${assignmentId}`
			);

			const checkIfSubmitted = (submissions, id) => {
				let findings;
				submissions.some(el => {
					if (el.student._id == id) {
						findings = el;
						return true;
					}
				});

				return findings;
			};

			
			const submission = checkIfSubmitted(assignment.data.submissions, req.user._id)
			
			if (!classDetails) {
				res.redirect("/404.ejs");
			} else {
				res.render("../views/pages/student-single-assignment.ejs", {
					layout: "./Layouts/student-navbar",
					currentRoute: "Classes",
					baseUrl: CONFIG.URI,
					classDetails: classDetails.data,
					classId,
					moment,
					submission,
					checkIfSubmitted,
					trunc: INCLUDES.TEXT_TRUNCATION,
					user: req.user,
					assignment: assignment.data,
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
