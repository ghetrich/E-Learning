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

const previlegeChecker = role => {
	switch (role) {
		case TYPES.ROLE_STUDENT:
			return "STUDENT";
		case TYPES.ROLE_SYSTEM_ADMIN:
			return "SYSTEM ADMIN";
		case TYPES.ROLE_ADMIN:
			return "ADMINISTRATOR";
		case TYPES.ROLE_TEACHER:
			return "TEACHER";
		case TYPES.ROLE_PRIVATE_TUTOR:
			return "PRIVATE";
		default:
			return "MISSING";
	}
};

app.get("/user/new", ensureAuth, onlyFor([ROLE.ADMIN]), async (req, res) => {
	try {
		const domain = await axios.get(
			`${CONFIG.URI}/community/get/domain/${req.user.community}`
		);
		res.render("../views/pages/new-community-user.ejs", {
			layout: "./Layouts/admin-navbar.ejs",
			currentRoute: "Users",
			roles: TYPES.COMMUNITY_ROLES,
			communityId: req.user.community,
			domain: domain.data,
		});
	} catch (error) {
		console.log(error);
		res.end("err");
	}
});

app.get("/users", onlyFor([ROLE.ADMIN]), async (req, res) => {
	const community = req.user.community;

	try {
		const users = await axios.get(
			`${CONFIG.URI}/user/community/${community}`
		);

		res.render("../views/pages/single-community-users.ejs", {
			layout: "./Layouts/admin-navbar",
			currentRoute: "Users",
			error: null,
			clients: users.data.data,
			moment,
			role: previlegeChecker,
		});
	} catch (error) {
		console.log(error);
		res.end("err");
	}
});

app.get("/dashboard", onlyFor([ROLE.ADMIN]), (req, res) => {
	res.render("../views/pages/admin-dashboard.ejs", {
		layout: "./Layouts/admin-navbar",
		currentRoute: "control",
	});
});





app.get("/classes/active", onlyFor([ROLE.ADMIN]), async (req, res) => {
	try {
		const classes = await axios.get(`${CONFIG.URI}/class/active`);

		res.render("../views/pages/admin-active-classes.ejs", {
			layout: "./Layouts/admin-navbar",
			currentRoute: "Classes",
			classes: classes.data || [],
			baseUrl: CONFIG.URI,
			moment,
		});
	} catch (error) {
		console.log(error);
		res.end("err");
	}
});

app.get("/classes", onlyFor([ROLE.ADMIN]), async (req, res) => {
	try {
		const classes = await axios.get(`${CONFIG.URI}/class`);

		res.render("../views/pages/admin-all-classes.ejs", {
			layout: "./Layouts/admin-navbar",
			currentRoute: "Classes",
			classes: classes.data || [],
			baseUrl: CONFIG.URI,
			moment,
		});
	} catch (error) {
		console.log(error);
		res.end("err");
	}
});


app.get("/class/students/:id", onlyFor([ROLE.ADMIN]), async (req, res) => {
	const classId = req.params.id;
	const community = req.user.community;
	try {
		const classDetails = await axios.get(`${CONFIG.URI}/class/${classId}`);
		const students = await axios.get(
			`${CONFIG.URI}/user/community/students/${community}`
		);

		const studentsJoined = classDetails.data.studentJoined.map(el => {
			return el._id;
		});

		console.log(studentsJoined);
		console.log(students.data);

		const topics = await axios.get(`${CONFIG.URI}/topics/class/${classId}`);
		if (!classDetails.data) {
			res.redirect("/admin/class/active");
		} else {
			res.render("../views/pages/class-students.ejs", {
				layout: "./Layouts/admin-single-class-navbar",
				currentRoute: "Classes",
				baseUrl: CONFIG.URI,
				classDetails: classDetails.data || [],
				route: "Students",
				classId,
				moment,
				studentsJoined,
				students: students.data,
				topics: topics.data || [],
			});
		}
	} catch (error) {
		console.log(error);
		res.end("err");
	}
});










module.exports = app;
