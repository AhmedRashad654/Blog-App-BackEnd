const express = require( 'express' );
const { getAllUser, getUser, updateProfile, countUser, uploadPhotoCtrl, deleteUser } = require( '../controllers/userController' );
const {
  verifyTokenAdmin,
  verifyTokenUser,
  verifyTokenAuthorization,
} = require( "../middlewire/tokenuser" );

const uploadPhoto = require( '../middlewire/uploadPhoto' );

let router = express.Router();
router.get( "/allUser", verifyTokenAdmin, getAllUser );
router.get("/countUser", verifyTokenAdmin, countUser);

router.get("/profile/:id", verifyTokenUser, getUser);
router.put( "/profile/:id", verifyTokenUser, updateProfile );
router.delete("/profile/:id", verifyTokenAuthorization, deleteUser);

router.post("/profile/photo-upload", verifyTokenUser,uploadPhoto.single('image') ,uploadPhotoCtrl);
module.exports = router;