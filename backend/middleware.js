const jwt = require("jsonwebtoken");

require("dotenv").config();

const JWTsecret = process.env.JWT_SECRET

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenHeaderArray = authHeader.split(" ");
  const tokenHeader = tokenHeaderArray[1];
  if(!tokenHeader){
    res.status(403).send({msg:"Error in token "})
  }
  try {
    const decoded = jwt.verify(tokenHeader, JWTsecret);

    req.userId = decoded.userId;

    next();
} catch (err) {
    return res.status(403).json({error:err});
}
}


module.exports = authMiddleware