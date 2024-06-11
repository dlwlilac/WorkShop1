const jwt = require("jsonwebtoken");

const middleware = {
    AuthCheck: async function (req, res, next) {
      try {
        const token = req.headers.authorization.split("Bearer ")[1];
        // console.log(token);
        const decoded = jwt.verify(token , process.env.JWT_KEY);
        req.auth = decoded;
        
        return next();
  
      } catch (error) {
        return res.status(401).send({
          status: 401,
          message: "Failed to Authenticate token",
        });
      }
    },
  };
  
  module.exports = { ...middleware };