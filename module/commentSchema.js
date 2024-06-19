const mongoose = require( 'mongoose' );
const Joi = require( 'joi' );
const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "postSchema",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSchema",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});
const validatCreateComment = ( obj ) => {
    const schema = Joi.object( {
        postId: Joi.string().required(),
        text:Joi.string().required()
    } )
    return schema.validate( obj );
}
const validatUpdateComment = (obj) => {
  const schema = Joi.object({
    text: Joi.string().required(),
  });
  return schema.validate(obj);
};
const comment = mongoose.model( 'comment', commentSchema );
module.exports = {
    comment,
    validatCreateComment,
    validatUpdateComment
}