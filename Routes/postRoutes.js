const express = require( 'express' );
const { createPost, getPost, getSinglePost, deletePost, updatePost, updateImagePost, addLikePost } = require( '../controllers/postController' );
const uploadPhoto = require( '../middlewire/uploadPhoto' );
const { verifyTokenUser, valideObjectId } = require( '../middlewire/tokenuser' );
let router = express.Router();

router.post( "/", verifyTokenUser, uploadPhoto.single( "image" ), createPost );
router.get("/", getPost);
router.post( "/:id", valideObjectId, getSinglePost );
router.delete( "/:id", valideObjectId, verifyTokenUser, deletePost );
router.put( "/:id", valideObjectId, verifyTokenUser, updatePost );
router.put(
  "/image/:id",
  valideObjectId,
  verifyTokenUser,
  uploadPhoto.single("image"),
  updateImagePost
);
router.put('/like/:id',valideObjectId,verifyTokenUser,addLikePost)
module.exports = router;