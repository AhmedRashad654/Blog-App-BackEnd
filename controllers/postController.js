const {
  validationCreatePost,
  postSchema,
  validationUpdatePost,
} = require("../module/postSchema");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");

/*****************************************
 * @desc            function create post
 * @routes          api/post/
 * @method          post
 * @access          public (only login)
 *****************************************/
const createPost = async (req, res) => {
  //1-validation for image
  if (!req.file) {
    return res.status(404).json({ message: "not image provided" });
  }
  //2-validation for date
  const { error } = validationCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    //3-upload Photo
    const pathImage = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(pathImage);
    //4-create new post and save in DB
    const newPost = await postSchema.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      user: req.id,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
    //5-send response to the client
    res.status(201).json({ message: "create post successfully", newPost });
    //6-Remove image from the server
    fs.unlinkSync(pathImage);
  } catch (erorr) {
    console.log(erorr);
  }
};
/*****************************************
 * @desc            function get post
 * @routes          api/post/
 * @method          get
 * @access          public
 *****************************************/
const getPost = async (req, res) => {
  try {
    const POST_PER_PAGE = 3;
    const { pageNumber, category } = req.query;
    let posts;
    if (pageNumber) {
      posts = await postSchema
        .find()
        .skip((pageNumber - 1) * POST_PER_PAGE)
        .limit(POST_PER_PAGE)
        .sort({ createdAt: -1 })
        .populate("user", ["-password"]);
    } else if (category) {
      posts = await postSchema
        .find({ category })
        .sort({ createdAt: -1 })
        .populate("user", ["-password"]);
    } else {
      posts = await postSchema
        .find()
        .sort({ createdAt: -1 })
        .populate("user", ["-password"]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};
/*****************************************
 * @desc            function get singel post
 * @routes          api/post/
 * @method          post
 * @access          public
 *****************************************/
const getSinglePost = async (req, res) => {
  try {
    const findPost = await postSchema
      .findById(req.params.id)
      .populate("user", ["-password"]);
    if (!findPost) {
      res.status(404).json({ message: "not found post" });
    }
    res.status(200).json(findPost);
  } catch (error) {
    console.log(error);
  }
};
/*****************************************
 * @desc            function delete post
 * @routes          api/post/
 * @method          delete
 * @access          private (only admin and user belong post)
 *****************************************/
const deletePost = async (req, res) => {
  try {
    const findPost = await postSchema.findById(req.params.id);
    if (!findPost) {
      return res.status(404).json({ message: "post not found" });
    }
    if (req.isAdmin || req.id === findPost.user.toString()) {
      await postSchema.findByIdAndDelete(req.params.id);
      await cloudinaryRemoveImage(findPost.image.publicId);
      res
        .status(200)
        .json({ message: "delete post successfully", postId: findPost._id });
    } else {
      res.status(403).json({ message: "not allowed" });
    }
  } catch (error) {
    console.log(error);
  }
};
/*****************************************
 * @desc            function update post
 * @routes          api/post/
 * @method          put
 * @access          private (only user belong post)
 *****************************************/
const updatePost = async (req, res) => {
  const { error } = validationUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const findPost = await postSchema.findById(req.params.id);
    if (!findPost) {
      return res.status(404).json({ message: "post not found" });
    }
    if (req.id !== findPost.user.toString()) {
      return res.status(403).json({ message: "not allowed" });
    }
    const updatePost = await postSchema
      .findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
          },
        },
        { new: true }
      )
    res.status(200).json({ message: "update successfully", updatePost });
  } catch (error) {
    console.log(error);
  }
};
/*****************************************
 * @desc            function update imagePost
 * @routes          api/post/
 * @method          put
 * @access          private (only user belong post)
 *****************************************/
const updateImagePost = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "image not provided" });
  }
  try {
    const findPost = await postSchema.findById(req.params.id);
    if (!findPost) {
      return res.status(404).json({ message: "post not found" });
    }
    if (req.id !== findPost.user.toString()) {
      return res.status(403).json({ message: "not allowed" });
    }
    await cloudinaryRemoveImage(findPost.image.publicId);
    //////////upload photo cloudinary/////////
    const parhImage = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(parhImage);
    ///////update db////////////
    const updataPhotoDb = await postSchema
      .findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            image: {
              url: result.secure_url,
              publicId: result.public_id,
            },
          },
        },
        { new: true }
      )
      .populate("user", ["-password"]);
    ////////response to user////////
    res
      .status(200)
      .json({ message: "upload photo succesfully", updataPhotoDb });
    ////////remove image from server///////////
    fs.unlinkSync(parhImage)
  } catch (error) {
    console.log(error);
  }
};
/*****************************************
 * @desc            function update imagePost
 * @routes          api/post/like
 * @method          put
 * @access          public (only user login)
 *****************************************/
const addLikePost = async ( req, res ) => {
  try {
    let findPost = await postSchema.findById(  req.params.id  );
    if ( !findPost ) {
    return  res.status( 404 ).json( { message: 'post not found' } );
    }
    const isLikedPost = findPost.like.find( ( e ) => e.toString() === req.id );
    if ( isLikedPost ) {
      findPost= await postSchema.findByIdAndUpdate( req.params.id,{
        $pull: {
          like:req.id
        }
      },{new:true})
    } else {
      findPost = await postSchema.findByIdAndUpdate( req.params.id, {
        $push: {
          like:req.id
        }
      },{new:true})
    }
    res.status(200).json({message:'success like'})
  } catch ( error ) {
    console.log( error );
  }
}
module.exports = {
  createPost,
  getPost,
  getSinglePost,
  deletePost,
  updatePost,
  updateImagePost,
  addLikePost,
};
