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
const expressUpload = require("express-fileupload");
const auth = require("./middleware/auth");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const roles = require("./Types.json");
const Cities = require("./cities.json");

const { ensureAuth, ensureGuest, renderControl } = require("./middleware/auth");

require("dotenv").config();

require("./config/passport")(passport);

const app = express();

const port = 3000;

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(expressUpload());
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
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
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
		case roles.ROLE_STUDENT:
			return "STUDENT";
		case roles.ROLE_SYSTEM_ADMIN:
			return "SYSTEM ADMIN";
		default:
			return "MISSING";
	}
};

app.get("/", ensureGuest, (req, res) => {

	res.render(__dirname + "/views/pages/login-register.ejs", {
		layout: "./Layouts/lr",
	});
});

app.get("/control", ensureAuth, renderControl, (req, res) => {
	res.render(__dirname + "/views/pages/control.ejs", {
		layout: "./Layouts/with-navbar",
		currentRoute: "control",
	});
});

app.get("/control-analytics", ensureAuth, renderControl,  (req, res) => {
	res.render(__dirname + "/views/pages/control-analytics.ejs", {
		layout: "./Layouts/with-navbar",
		currentRoute: "control",
	});
});

app.get("/community", ensureAuth, renderControl, (req, res) => {
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
});

app.get("/community-new", ensureAuth, renderControl, (req, res) => {
	res.render(__dirname + "/views/pages/new-community.ejs", {
		layout: "./layouts/with-navbar",
		currentRoute: "community",
		regions: Cities,
	});
});

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
					layout: "./layouts/without-navbar",
					currentRoute: "community",
					community: data.data,
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
					currentRoute: "Clients",
					user: null,
					error: data.error,
				});
			} else {
				res.render(__dirname + "/views/pages/single-client.ejs", {
					layout: "./layouts/without-navbar",
					currentRoute: "Clients",
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

			console.log(data);
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

// app.get("/error-404", (req, res) => {
// 	res.render(__dirname + "/views/errors/404.ejs", {
// 		layout: "./Layouts/error-layout",
// 	});
// });

// app.get("/dashboard", ensureAuth, (req, res) => {
// 	res.render(__dirname + "/views/pages/dashboard.ejs", {
// 		layout: "./Layouts/layout",
// 		name: { surname: req.user.surname, othernames: req.user.othernames },
// 		profileImg: req.user.image,
// 	});
// });

app.use("/uploads", express.static("./uploads"));

const userRouter = require("./router/user");
const communityRouter = require("./router/community");
const studentRouter = require("./router/student");

app.use("/user", userRouter);
app.use("/community", communityRouter);
app.use("/student", studentRouter);
app.use("/auth", require("./router/auth"));

app.listen(port, () => console.log(`App running on port ${port}`));
