const { userSchema, validationUserUpdate } = require("../module/userSchema");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

/*****************************************
 * @desc            function getAllUser
 * @routes          api/user/allUser
 * @method          GET
 * @access          private
 *****************************************/
const getAllUser = async (req, res) => {
  try {
    const findAllUser = await userSchema.find().populate("posts");
    res.status(201).json({ message: "read success", data: findAllUser });
  } catch (error) {
    console.log(error);
  }
};
/*****************************************
 * @desc            function getUser
 * @routes          api/user/profile/:id
 * @method          GET
 * @access          public (only himself)
 *****************************************/
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (id !== req.id) {
      return res.status(400).json({ message: "this is only himself" });
    }
    const findUser = await userSchema
      .findById(id)
      .populate("posts")
      .select("-password");;
    if (!findUser) {
      return res.status(400).json({ message: "user Not Found" });
    }
    res
      .status(200)
      .json({ message: "read success", data: findUser })
      
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/*****************************************
 * @desc            function updateUser
 * @routes          api/user/profileUpdate/:id
 * @method          PUT
 * @access          public (only himself)
 *****************************************/
const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { error } = validationUserUpdate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    try {
      if (id !== req.id) {
        return res.status(400).json({ message: "this is only himself" });
      }
      if (req.body.password) {
        const gen = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, gen);
      }

      const findUser = await userSchema
        .findByIdAndUpdate(
          id,
          {
            $set: {
              userName: req.body.userName,
              password: req.body.password,
              bio: req.body.bio,
            },
          },
          { new: true }
        )
        .select("-password");
      if (!findUser) {
        return res.status(400).json({ message: "user Not Found" });
      }
      res.status(200).json({ message: "read success", data: findUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
/*****************************************
 * @desc            function countUser
 * @routes          api/user/countUser
 * @method          GET
 * @access          private (only admin)
 *****************************************/
const countUser = async (req, res) => {
  try {
    const countUser = await userSchema.countDocuments();
    res.status(201).json({ message: countUser });
  } catch (error) {
    console.log(error);
  }
};
/*****************************************
 * @desc            function upload
 * @routes          api/user/profile/profile-photo-upload
 * @method          post
 * @access          private (only user himself)
 *****************************************/
const uploadPhotoCtrl = async (req, res) => {
  try {
    //1-validation
    if (!req.file) {
      return res.status(400).json({ message: "not profile photo" });
    }
    //2-Get the path to the Image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    //3-Upload to cloudinary
    const resultUploadImage = await cloudinaryUploadImage(imagePath);
    //4-Get the user from DB
    const findUser = await userSchema.findById(req.id);
    //5-Delete old profile photo if exist
    if (findUser.profilePhoto.publicId !== null) {
      await cloudinaryRemoveImage(findUser.profilePhoto.publicId);
    }
    //6-change the profile photo field in DB
    findUser.profilePhoto = {
      url: resultUploadImage.secure_url,
      publicId: resultUploadImage.public_id,
    };
    await findUser.save();
    //7-send response to client
    res.status(201).json({
      message: "upload photo successfuly",
      profilePhoto: {
        url: resultUploadImage.secure_url,
        publicId: resultUploadImage.publicId,
      },
    });
    //8-Remove Image from server
    fs.unlinkSync(imagePath);
  } catch (error) {
    console.log(error);
  }
};
/*****************************************
 * @desc            function delete user
 * @routes          api/user/profile/:id
 * @method          delete
 * @access          private (only admin and user himself)
 *****************************************/
const deleteUser =async ( req, res ) => {
  const { id } = req.params;
  try {
    //1-Get user from DB
    const findUser = await userSchema.findById( id );
    if ( !findUser ) {
        return  res.status( 404 ).json( { message: 'user Not Fount' } );
    }
    //2-Get All posts from DB
    //3-Get the public ids from the posts
    //4-Delete all image posts from cloudiary belong this user
    //5-Delete the profile picture from cloudinary
    await cloudinaryRemoveImage( findUser.profilePhoto.publicId );
    //6-Delete user user&comments
    //7-Delete the user himself
    await userSchema.findByIdAndDelete( id );  
    //8-send a response the client
    res.status( 200 ).json( { message: 'user deleted successfully' } );
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getAllUser,
  getUser,
  updateProfile,
  uploadPhotoCtrl,
  countUser,
  deleteUser
};

