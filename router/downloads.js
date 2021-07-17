const Router = require("express").Router();
const zip = require("express-zip")
const { ensureAuth, ensureGuest } = require("../middleware/auth");

Router.get("/", async (req, res) => {
    
res.zip({path: "../uploads/materials/1624595794585.pdf", name: "material"})

})




module.exports = Router