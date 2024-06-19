const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

//////////////verifyTokenAdmin///////////////
const verifyTokenAdmin = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(403).json({ message: "you must Login" });
  }
  const decodeToken = jwt.verify(
    authorization.split(" ")[1],
    process.env.SECRET_JWT
  );
  if (!decodeToken.isAdmin) {
    return res.status(403).json({ message: "not allowed, only admin" });
  }
  next();
};
/////////valide object Id//////////////
const valideObjectId = async ( req, res ,next) => {
  if ( !mongoose.Types.ObjectId.isValid( req.params.id ) ) {
    return res.status( 400 ).json( { message: 'invalid id' } );
  }
  next()
}
////////////verifyTokenUser////////////////
const verifyTokenUser = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(403).json({ message: "you must Login" });
  }
  const decodeToken = jwt.verify(
    authorization.split(" ")[1],
    process.env.SECRET_JWT
  );
  req.id = decodeToken.id;
  req.isAdmin = decodeToken.isAdmin;
  next();
};
////////////verifyTokenAuthorization////////////////
const verifyTokenAuthorization = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(403).json({ message: "you must Login" });
  }
  const decodeToken = jwt.verify(
    authorization.split(" ")[1],
    process.env.SECRET_JWT
  );
  if (req.params.id === decodeToken.id || decodeToken.isAdmin) {
    req.id = decodeToken.id;
    next();
  } else {
    res.status(403).json({ message: "this not allowed" });
  }
};

module.exports = {
  verifyTokenAdmin,
  verifyTokenUser,
  verifyTokenAuthorization,
  valideObjectId,
};
