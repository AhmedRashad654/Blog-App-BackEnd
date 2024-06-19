const Joi = require( "joi" );
const mongoose = require("mongoose");
const posSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minlength: 10,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userSchema",
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
posSchema.virtual("comments", {
  ref: "comment",
  foreignField: "postId",
  localField: "_id",
});
///////////////function validation schema post/////////////////
const validationCreatePost = ( obj ) => {
    const Schema = Joi.object({
      title: Joi.string().trim().min(2).max(100).required(),
      description: Joi.string().trim().min(10).max(100).required(),
      category: Joi.string().required(),
    } );
    return Schema.validate(obj)
}
///////////////function validation update post/////////////////
const validationUpdatePost = ( obj ) => {
    const Schema = Joi.object({
      title: Joi.string().trim().min(2).max(100),
      description: Joi.string().trim().min(10).max(100),
      category: Joi.string(),
    } );
    return Schema.validate(obj)
}
const postSchema = mongoose.model( 'postSchema', posSchema );
module.exports = {
  postSchema,
  validationCreatePost,
  validationUpdatePost,
};