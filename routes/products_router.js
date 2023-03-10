const express = require("express")
const router = express.Router()

const {getAllProducts} = require("../controllers/product_controllers")

router.route("/").get(getAllProducts)

module.exports = router