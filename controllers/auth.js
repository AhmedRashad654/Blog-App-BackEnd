
const { userSchema, validationUserRegister,validationUserlogin } = require( "../module/userSchema" );
const bcrypt = require( "bcrypt" );
const jwt = require( "jsonwebtoken" );
/*****************************************
 * @desc            function register
 * @routes          api/auth/register  
 * @method          post
 * @access          public
 *****************************************/
const register = async ( req, res ) => {
  console.log(req.body)
    const { error } = validationUserRegister( req.body );
    if ( error ) {
        return res.status(400).json({message:error.details[0].message})
    } else {
        try {
            const user = await userSchema.findOne( { email: req.body.email } );
            if ( user ) {
                return res.status( 400 ).json( { message: "email already exists" } );
            }
            const salt = await bcrypt.genSalt( 10 );
            const hashpassword = await bcrypt.hash( req.body.password, salt );
             newuser = await userSchema( {
                userName: req.body.userName,
                email: req.body.email,
                password:hashpassword
             } )
            await newuser.save();
            res
              .status(201)
              .json({
                message: "success register, please Login",
                data: newuser,
              });
           } catch (error) {
             console.log(error);
           }
    }
 
}

/*****************************************
 * @desc            function register
 * @routes          api/auth/register  
 * @method          post
 * @access          public
 *****************************************/

const login =async ( req, res ) => {
    const { error } = validationUserlogin( req.body );
    if ( error ) {
     return    res.status( 400 ).json( { message: error.details[ 0 ].message } );
    }
    const findEmail = await userSchema.findOne( { email: req.body.email } );
    if( !findEmail ){
     return   res.status( 400 ).json( { message: "invalid email " } );
    }
    const checkpassword = await bcrypt.compare( req.body.password, findEmail.password);
     if( !checkpassword ){
      return  res.status( 400 ).json( { message: "invalid password" } );
    }
    const token  = jwt.sign({id:findEmail._id,isAdmin:findEmail.isAdmin},process.env.SECRET_JWT)
    res.status(201).json({
      message: "success Login",
      data: {
          _id: findEmail._id,
          userName:findEmail.userName,
        isAdmin: findEmail.isAdmin,
          profilePhoto: findEmail.profilePhoto,
        token:token
      },
    });

}
module.exports={register,login}