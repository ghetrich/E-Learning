const express = require("express");
const express_layout = require("express-ejs-layouts");
const FormData = require("form-data");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo")(session);
const { v4: uuidv4 } = require("uuid");
const auth = require("./middleware/auth");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const Types = require("./Types.json");
const Cities = require("./cities.json");

const {
	ensureAuth,
	ensureGuest,
	renderControl,
	onlyFor,
} = require("./middleware/auth");

require("dotenv").config();

require("./config/passport")(passport);

const app = express();

const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/fonts", express.static(__dirname + "/public/fonts"));
app.use("/images", express.static(__dirname + "/public/images"));
app.use("/img", express.static(__dirname + "/public/img"));
app.use("/js", express.static(__dirname + "/public/js"));

app.use(express_layout);
app.set("layout", "./layouts/layout");
app.set("view engine", "ejs");

app.use(flash());
app.use(
	session({
		secret: "keyboard",
		resave: false,
		saveUninitialized: true,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

const uri = process.env.ATLAS_ULI;
mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

mongoose.connection
	.once("open", () => {
		console.log("connected");
	})
	.on("error", error => {
		console.log("error", error);
	});

/************************************
 *  HELPER FUNCTIONS
 **********************************/

const previlegeChecker = role => {
	switch (role) {
		case Types.ROLE_STUDENT:
			return "STUDENT";
		case Types.ROLE_SYSTEM_ADMIN:
			return "SYSTEM ADMIN";
		case Types.ROLE_ADMIN:
			return "ADMINISTRATOR";
		case Types.ROLE_TEACHER:
			return "TEACHER";
		case Types.ROLE_PRIVATE_TUTOR:
			return "PRIVATE";
		default:
			return "MISSING";
	}
};

// app.use(function (req, res, next) {
// 	if (!req.user)
// 		res.header(
// 			"Cache-Control",
// 			"private, no-cache, no-store, must-revalidate"
// 		);
// 	next();
// });

app.get("/", ensureGuest, (req, res) => {
	res.render(__dirname + "/views/pages/login-register.ejs", {
		layout: "./Layouts/lr",
	});
});

app.get("/control", renderControl, (req, res) => {
	if (req.user.previlege === Types.ROLE_SYSTEM_ADMIN) {
		res.render(__dirname + "/views/pages/control.ejs", {
			layout: "./Layouts/with-navbar",
			currentRoute: "control",
		});
	} else if (req.user.previlege === Types.ROLE_ADMIN) {
		axios
			.get(`http://localhost:3000/community/single/${req.user.community}`)
			.then(response => {
				const community = response.data.data;
				res.render(__dirname + "/views/pages/admin-control.ejs", {
					layout: "./Layouts/admin-navbar",
					currentRoute: "control",
					error: null,
					community: community,
					logo: `http://localhost:3000/${community.logo}`,
				});
			})
			.catch(error => {
				res.render(__dirname + "/views/pages/admin-control.ejs", {
					layout: "./Layouts/admin-navbar",
					currentRoute: "control",
					error: "errror",
					community: null,
				});
			});
	} else if (req.user.previlege === Types.ROLE_STUDENT) {
		axios
			.get(`http://localhost:3000/community/single/${req.user.community}`)
			.then(response => {
				const community = response.data.data;
				res.render(__dirname + "/views/pages/student-control.ejs", {
					layout: "./Layouts/student-navbar",
					currentRoute: "control",
					error: null,
					community: community,
					logo: `http://localhost:3000/${community.logo}`,
				});
			})
			.catch(error => {
				res.render(__dirname + "/views/pages/admin-control.ejs", {
					layout: "./Layouts/student-navbar",
					currentRoute: "control",
					error: "errror",
					community: null,
				});
			});
	} else if (req.user.previlege === Types.ROLE_TEACHER) {
		axios
			.get(`http://localhost:3000/community/single/${req.user.community}`)
			.then(response => {
				const community = response.data.data;
				res.render(__dirname + "/views/pages/teacher-control.ejs", {
					layout: "./Layouts/teacher-navbar",
					currentRoute: "control",
					error: null,
					community: community,
					logo: `http://localhost:3000/${community.logo}`,
				});
			})
			.catch(error => {
				res.render(__dirname + "/views/pages/admin-control.ejs", {
					layout: "./Layouts/student-navbar",
					currentRoute: "control",
					error: "errror",
					community: null,
				});
			});
	} else {
		res.render(__dirname + "/views/pages/404.ejs", {
			layout: "./Layouts/lr",
		});
	}
});

app.get(
	"/control-analytics",
	ensureAuth,
	onlyFor(["systemadministrator"]),
	(req, res) => {
		res.render(__dirname + "/views/pages/control-analytics.ejs", {
			layout: "./Layouts/with-navbar",
			currentRoute: "control",
		});
	}
);

app.get(
	"/dashboard/admin",
	ensureAuth,
	onlyFor(["administrator"]),
	(req, res) => {
		res.render(__dirname + "/views/pages/admin-dashboard.ejs", {
			layout: "./Layouts/admin-navbar",
			currentRoute: "control",
		});
	}
);

app.get(
	"/community",
	ensureAuth,
	onlyFor([Types.ROLE_SYSTEM_ADMIN]),
	(req, res) => {
		axios
			.get("http://localhost:3000/community/all")
			.then(response => {
				const data = response.data.data;

				res.render(__dirname + "/views/pages/community.ejs", {
					layout: "./layouts/with-navbar",
					currentRoute: "community",
					error: "",
					communities: data,
					moment,
				});
			})
			.catch(err => {
				res.render(__dirname + "/views/pages/community.ejs", {
					layout: "./layouts/with-navbar",
					currentRoute: "community",
					error: err,
				});
			});
	}
);

app.get("/community-new", ensureAuth, renderControl, (req, res) => {
	res.render(__dirname + "/views/pages/new-community.ejs", {
		layout: "./layouts/with-navbar",
		currentRoute: "community",
		regions: Cities,
	});
});

app.get(
	"/community/user/new",
	ensureAuth,
	onlyFor([Types.ROLE_ADMIN]),
	(req, res) => {
		axios
			.get(
				`http://localhost:3000/community/get/domain/${req.user.community}`
			)
			.then(response => {
				const data = response.data.data;

				res.render(__dirname + "/views/pages/new-community-user.ejs", {
					layout: "./layouts/admin-navbar",
					currentRoute: "users",
					roles: Types.COMMUNITY_ROLES,
					communityId: req.user.community,
					domain: data.domain,
				});
			})
			.catch(err => {
				res.render("null");
			});

		// console.log(req.user);
	}
);

app.get("/single/community/:id", ensureAuth, renderControl, (req, res) => {
	const community = req.params.id;

	axios
		.get(`http://localhost:3000/community/single/${community}`)
		.then(response => {
			const data = response.data;

			if (data.status === "BAD") {
				res.render(__dirname + "/views/pages/single-community.ejs", {
					layout: "./layouts/with-navbar",
					currentRoute: "community",
					community: null,
					error: data.error,
				});
			} else {
				res.render(__dirname + "/views/pages/single-community.ejs", {
					layout: "./layouts/with-navbar",
					currentRoute: "community",
					community: data.data,
					logo: `http://localhost:3000/${data.data.logo}`,
					error: null,
				});
			}
		})
		.catch(err => {
			res.render(__dirname + "/views/pages/single-community.ejs", {
				layout: "./layouts/with-navbar",
				currentRoute: "community",
				error: err,
			});
		});
});

app.get("/single/client/:id", ensureAuth, renderControl, (req, res) => {
	const client = req.params.id;

	axios
		.get(`http://localhost:3000/user/single/${client}`)
		.then(response => {
			const data = response.data;

			if (data.status === "BAD") {
				res.render(__dirname + "/views/pages/single-client.ejs", {
					layout: "./layouts/without-navbar",
					currentRoute: "Users",
					user: null,
					error: data.error,
				});
			} else {
				res.render(__dirname + "/views/pages/single-client.ejs", {
					layout: "./layouts/admin-navbar",
					currentRoute: "Users",
					user: data.data,
					error: null,
				});
			}
		})
		.catch(err => {
			res.render(__dirname + "/views/pages/single-client.ejs", {
				layout: "./layouts/with-navbar",
				currentRoute: "Clients",
				error: err,
			});
		});
});

app.get("/activation", (req, res) => {
	const userId = req.user._id;

	if (req.user.isActivated) {
		res.redirect("/control");
	} else {
		res.render(__dirname + "/views/pages/activation.ejs", {
			layout: "./Layouts/lr",
			status: "",
			error: "",
		});
	}
});

app.get("/clients", ensureAuth, renderControl, (req, res) => {
	axios
		.get("http://localhost:3000/user/all")
		.then(response => {
			const data = response.data.data;

			// console.log(data);
			res.render(__dirname + "/views/pages/clients.ejs", {
				layout: "./layouts/with-navbar",
				currentRoute: "Clients",
				error: "",
				clients: data,
				moment,
				role: previlegeChecker,
			});
		})
		.catch(err => {
			res.render(__dirname + "/views/pages/clients.ejs", {
				layout: "./layouts/with-navbar",
				currentRoute: "Clients",
				error: err,
			});
		});
});

app.get("/unAuthorized", (req, res) => {
	res.render(__dirname + "/views/pages/400.ejs", {
		layout: "./Layouts/lr",
	});
});

app.get("/community/users", onlyFor([Types.ROLE_ADMIN]), (req, res) => {
	const community = req.user.community;

	axios
		.get(`http://localhost:3000/user/community/${community}`)
		.then(response => {
			const data = response.data.data;
			console.log(data);
			res.render(__dirname + "/views/pages/single-community-users.ejs", {
				layout: "./Layouts/admin-navbar",
				currentRoute: "users",
				error: null,
				clients: data,
				moment,
				role: previlegeChecker,
			});
		})
		.catch(err => {
			res.render(__dirname + "/views/pages/single-community-users.ejs", {
				layout: "./Layouts/admin-navbar",
				currentRoute: "users",
				error: err,
			});
		});
});

app.use("/uploads", express.static("./uploads"));

const userRouter = require("./router/user");
const communityRouter = require("./router/community");
const studentRouter = require("./router/student");
const systemAdminRouter = require("./router/systemadministrator");
const adminRouter = require("./router/administrator");
const adminController = require("./controller/admin");
const teacherRouter = require("./router/teacher");
const classRouter = require("./router/class");

app.use("/user", userRouter);
app.use("/community", communityRouter);
app.use("/student-route", studentRouter);
app.use("/systemadministrator", systemAdminRouter);
app.use("/administrator", adminRouter);
app.use("/class", classRouter);
app.use("/topics", require("./router/topicRouter"));
app.use("/Exam", require("./router/exams"));
app.use("/announcement", require("./router/announcement"));
app.use("/lessons", require("./router/lesson"));
app.use("/download", require("./router/downloads"));
app.use("/teacher", teacherRouter);
app.use("/auth", require("./router/auth"));

app.use("/admin", adminController);
app.use("/teacher", require("./controller/teacher"));
app.use("/getClass", require("./controller/class"));
app.use("/student", require("./controller/student"));
app.use("/announcement", require("./controller/announcement"));
app.use("/exams", require("./controller/exams"));
app.listen(port, () => console.log(`App running on port ${port}`));
