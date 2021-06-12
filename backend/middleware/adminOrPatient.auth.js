const { error } = require("console");
const jwt = require("jsonwebtoken");

//this middleware will extarct token from incoming request
//if that token is not in the incoming request, or its not valid
//it will not allow to reach the protected routes
//we will attach this middleware, after the path
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const Role = req.headers.authorization.split(" ")[2];

    const patientAuthToken = req.headers.patientauthorization.split(" ")[1];

    if (token && Role == "Admin") {
      const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
      //we can add new field to the request
      //then all the middleware running after this middleware(e.g checkAuth in doctors routes) can access these fields
      //this will help to make relation between models(e.g we will add adminId field in Doctor Model)
      req.adminData = {
        email: decodedToken.email,
        id: decodedToken.adminId,
        role: "Admin",
      };
    } else if (token && Role == "Doctor") {
      const decodedDoctorToken = jwt.verify(
        token,
        "secret_doctor_this_should_be_longer"
      );
      req.adminData = {
        email: decodedDoctorToken.email,
        id: decodedDoctorToken.adminId,
        role: "Doctor",
      };
    } else if (patientAuthToken) {
      jwt.verify(
        patientAuthToken,
        "secret_fetchedPatient_this_should_be_longer"
      );
    } else {
      throw error;
    }

    next();
  } catch {
    res.status(401).json({ message: "Auth4-- failed" });
  }
};
