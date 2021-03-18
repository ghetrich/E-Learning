const Router = require("express").Router();
const Student = require("../model/student");
const User = require("../model/user");

// Router.route("/all").get((req, res) => {
// 	Student.find()
// 		.then(students => {
// 			return res.status(200).send({ status: "OK", data: students });
// 		})
// 		.catch(error => {
// 			res.status(404).send(error);
// 		});
// });


Router.route("/all").get((req, res) => {
    User.find({previlege:"student"})
        .populate("owner")
        .select("-password")
		.then(students => {
			return res.status(200).send({ status: "OK", data: students });
		})
		.catch(error => {
			res.status(404).send(error);
		});
});

// Router.route("/single/:community").get((req, res) => {
// 	const communityId = req.params.community;

// 	if (communityId === undefined || communityId === "") {
// 		return res
// 			.status(400)
// 			.send({
// 				status: "BAD",
// 				error: "Cannot find community with id" + communityId,
// 			});
// 	}

// 	Community.findById(communityId)
// 		.then(community => {
// 			return res.status(200).send({ status: "OK", data: community });
// 		})
// 		.catch(error => {
// 			res.status(404).send(error);
// 		});
// });



module.exports = Router;
