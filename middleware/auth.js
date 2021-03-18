module.exports = {
	ensureAuth: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect("/");
		}
	},

	ensureGuest: function (req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect("/control");
		} else {
			return next();
		}
	},

	accessVerification: roles => (req, res, next) => {
		if (req.isAuthenticated()) {
			!roles.includes(req.user.previlege)
				? res.redirect("/unAuthorized")
				: next();
		} else {
			res.redirect("/");
		}
	},

	renderControl: function (req, res, next) {
		if (req.isAuthenticated()) {
			if (!req.user.isActivated) {
				res.redirect("/activation");
			} else {
				if (req.user.previlege === "systemadministrator") {
					return next();
				} else {
					res.send(req.user.previlege);
				}
			}
		}
	},
};
