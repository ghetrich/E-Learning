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

// app.get(
// 	"/my-classes",
// 	ensureAuth,
// 	onlyFor([ROLE.TEACHER]),
// 	async (req, res) => {
// 		try {
// 			const domain = await axios.get(
// 				`${CONFIG.URI}/community/get/domain/${req.user.community}`
// 			);
// 			const classes = await axios.get(
// 				`${CONFIG.URI}/teacher/classes/main/${req.user.id}`
// 			);

// 			res.render("../views/pages/teacher-classes.ejs", {
// 				layout: "./Layouts/teacher-navbar.ejs",
// 				currentRoute: "Classes",
// 				roles: TYPES.COMMUNITY_ROLES,
//                 communityId: req.user.community,
//                 baseUrl: CONFIG.URI,
// 				domain: domain.data,
// 				classes: classes.data || [],
// 			});
// 		} catch (error) {
// 			console.log(error);
// 			res.end("err");
// 		}
// 	}
// );

app.get("/class/:filter", onlyFor([ROLE.TEACHER]), async (req, res) => {
	const teacher = req.user.id;
	const filter = req.params.filter;
	try {
		const classDetails = await axios.get(
			`${CONFIG.URI}/teacher/classes/${filter}/${teacher}`
		);

		if (!classDetails) {
			res.redirect("/404.ejs");
		} else {
			res.render("../views/pages/teacher-classes.ejs", {
				layout: "./Layouts/teacher-navbar",
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

app.get("/class/students/:id", onlyFor([ROLE.TEACHER]), async (req, res) => {
	const classId = req.params.id;
	try {
		const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
		const topics = await axios.get(`${CONFIG.URI}/topics/class/${classId}`);

		if (!classDetails.data) {
			res.redirect("/404.ejs");
		} else {
			res.render("../views/pages/teacher-class-students.ejs", {
				layout: "./Layouts/teacher-single-class-navbar",
				currentRoute: "Classes",
				baseUrl: CONFIG.URI,
				classDetails: classDetails.data,
				route: "Students",
				classId,
				moment,
				topics: topics.data || [],
			});
		}
	} catch (error) {
		console.log(error);
		res.end("err");
	}
});



module.exports = app;
