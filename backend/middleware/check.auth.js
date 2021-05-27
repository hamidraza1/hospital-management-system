const jwt = require("jsonwebtoken");

//this middleware will extarct token from incoming request
//if that token is not in the incoming request, or its not valid
//it will not allow to reach the protected routes
//we will attach this middleware, after the path
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_this_should_be_longer");
    next();
  } catch {
    res.status(401).json({ message: "Auth4 failed" });
  }
};
