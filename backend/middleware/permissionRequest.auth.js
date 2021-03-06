const jwt = require("jsonwebtoken");

//this middleware will extarct token from incoming request
//if that token is not in the incoming request, or its not valid
//it will not allow to reach the protected routes
//we will attach this middleware, after the path
module.exports = (req, res, next) => {
  try {
    const token = req.headers.permissiontosignupauthorization.split(" ")[1];

    const decodedToken = jwt.verify(
      token,
      "secret_fetchedAdminOrDoc_this_should_be_longer"
    );
    //we can add new field to the request
    //then all the middleware running after this middleware(e.g checkAuth in doctors routes) can access these fields
    //this will help to make relation between models(e.g we will add adminId field in Doctor Model)
    next();
  } catch {
    res.status(401).json({ message: "Auth4* failed" });
  }
};
