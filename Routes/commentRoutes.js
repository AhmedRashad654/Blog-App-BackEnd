const express = require( 'express' );
let router = express.Router();
const { createComment, getAllComment, deleteComment, updateComment } = require( '../controllers/commentController' );
const { verifyTokenUser, verifyTokenAdmin } = require( '../middlewire/tokenuser' );
router.post( "/", verifyTokenUser, createComment );
router.get( "/", verifyTokenAdmin, getAllComment );
router.delete("/:id", verifyTokenUser, deleteComment);
router.put("/:id", verifyTokenUser, updateComment);

module.exports = router;