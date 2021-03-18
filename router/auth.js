const Router = require("express").Router();
const User = require("../model/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dsfirf'wewpewereknknksdfnweiewpw'[p32j032233249o3[p";

Router.route("/google").get(
	passport.authenticate("google", { scope: ["profile"] })
);

Router.route("/google/callback").get(
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => {
		res.redirect("/dashboard");
	}
);

Router.route("/logout").get((req, res) => {	
	req.logout();
	res.redirect("/control");
});

module.exports = Router;
