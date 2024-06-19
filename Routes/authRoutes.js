const express = require( 'express' );
const { register, login } = require("../controllers/auth");
let router = express.Router();

router.post( '/register', register );
router.post("/login", login);

module.exports = router;