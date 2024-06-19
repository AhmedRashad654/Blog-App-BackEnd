const { comment, validatCreateComment, validatUpdateComment } = require( "../module/commentSchema" );
const { postSchema } = require( "../module/postSchema" );

/*****************************************
 * @desc            function create Comment
 * @routes          api/comment/
 * @method          post
 * @access          public (only user login)
 *****************************************/
const createComment = async ( req, res ) => {
    const { error } = validatCreateComment(req.body);
    if ( error ) {
         return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const findPost = await postSchema.findById( req.body.postId );

        if ( !findPost ) {
            return res.status(404).json( { message: 'post not Found' } );
        }
        const newComment = await comment.create( {
            postId: req.body.postId,
            userId: req.id,
            text:req.body.text,
        })
        res.status(201).json({ message: "create succesfully", newComment });

    } catch ( error ) {
        console.log( error );
    }
}
/*****************************************
 * @desc            function get All Comment
 * @routes          api/comment/
 * @method          Get
 * @access          private (only admin)
 *****************************************/
const getAllComment = async ( req, res ) => {
    try {
        const findAllComment = await comment.find();
        if ( !findAllComment ) {
            return res.status( 404 ).json( { message: 'not Found Comment Yet' } );
        }
        res.status( 200 ).json( { mesaage: 'read successe', findAllComment } );
    } catch ( error ) {
        console.log( error );
    }
}
/*****************************************
 * @desc            function delete Comment
 * @routes          api/comment/:id
 * @method          Get
 * @access          private (only admin and belong comment)
 *****************************************/
const deleteComment = async ( req, res ) => {
    try {
        const findComment = await comment.findById( req.params.id );
        if ( !findComment ) {
            return res.status( 404 ).json( { message: 'comment not found' } );
        }
        if ( req.isAdmin || req.id === comment.user.toString() ) {
               await comment.findByIdAndDelete(req.params.id);
               res.status(200).json({ message: "delete Succesfully" });
        } else {
               res.status(403).json({ message: "not allowed" });
            
        };
      
    } catch ( error ) {
        console.log( error );
    }
}
/*****************************************
 * @desc            function update Comment
 * @routes          api/comment/:id
 * @method          Get
 * @access          private (only  belong comment)
 *****************************************/
const updateComment = async ( req, res ) => {
    const { error } = validatUpdateComment( req.body );
    if ( error ) {
        return res.status( 400 ).json( { message: error.details[ 0 ].message } );
    }
    try {
        const findComment = await comment.findById( req.params.id );
        if ( !findComment ) {
            return res.status( 404 ).json( { message: 'comment Not Found' } );
        }
        if ( req.id === findComment.userId.toString() ) {
            let updated = await comment.findByIdAndUpdate(
              req.params.id,
              {
                $set: {
                  text: req.body.text,
                },
              },
              { new: true }
            );
           return res.json( { message: "update succesfully", updated } );
        } else {
            res
              .status(403)
              .json({ message: "not allowed", updated });
            
        }
    } catch ( error ) {
        console.log( error );
    }
}
module.exports = {
  createComment,
  getAllComment,
  deleteComment,
  updateComment,
};
