const Joi = require("joi");
const mongoose = require("mongoose");
const useSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 100,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 100,
    },
    bio: {
      type: String,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        publicId: null,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
useSchema.virtual("posts", {
  ref: "postSchema",
  foreignField: "user",
  localField: "_id",
});
function validationUserRegister(obj) {
  const schema = Joi.object({
    userName: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().min(5).max(100).required(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}
function validationUserlogin(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required(),
    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}
function validationUserUpdate(obj) {
  const schema = Joi.object({
    userName: Joi.string().trim().min(5).max(100),
    password: Joi.string().trim().min(8),
    bio: Joi.string().trim(),
  });
  return schema.validate(obj);
}
const userSchema = mongoose.model("userSchema", useSchema);
module.exports = {
  userSchema,
  validationUserRegister,
  validationUserlogin,
  validationUserUpdate,
};
