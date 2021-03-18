const Router = require("express").Router();
const Community = require("../model/community");
const upload = require("../middleware/upload");

Router.route("/all").get((req, res) => {
	Community.find()
		.then(community => {
			return res.status(200).send({ status: "OK", data: community });
		})
		.catch(error => {
			res.status(404).send(error);
		});
});

Router.route("/single/:community").get((req, res) => {

	const communityId = req.params.community

	if (communityId === undefined || communityId === "") {
		return res.status(400).send({ status: "BAD", error:"Cannot find community with id" + communityId });
	}

	Community.findById(communityId)
		.then(community => {
			return res.status(200).send({ status: "OK", data: community });
		})
		.catch(error => {
			res.status(404).send(error);
		});
});

Router.route("/new").post(upload.single("logo"), (req, res) => {
	console.log(req.body);
	const { name, alias, slogan } = req.body;

	const address = {
		telephone: req.body.telephone,
		region: req.body.region,
		city: req.body.city,
	};

	if (
		!name ||
		!alias ||
		!slogan ||
		!address.city ||
		!address.telephone ||
		!address.region
	) {
		return res.status(404).send({ message: "all field are required" });
	}
	const newCommunity = new Community({
		name,
		alias,
		slogan,
		address,
	});

    if (req.file) {
        
        newCommunity.logo = req.file.pathname
	}

	Community.find({ name })
		.then(community => {
			if (community.length > 0) {
				return res
					.status(404)
					.send({ message: "commuinty already exists" });
			}

			newCommunity
				.save()
				.then(() => {
					return res.status(200).send({
						status: "OK",
						data: "COMMUNITY CREATED",
					});
				})
				.catch(err => {
					console.log(err);
					return res.status(404).send(err);
				});
		})
		.catch(error => {
			console.log(error);
			return res.status(404).send(error);
		});
});

module.exports = Router;
