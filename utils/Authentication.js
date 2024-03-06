const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_secret_key = process.env.JWT_SECRET;

const checkToken = (request, reply, next) =>{
    let headers = request.headers
    let token = headers["authorization"];
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      jwt.verify(token, jwt_secret_key, (err, decoded) => {
        if (err) {
          return reply.code(401).send({
            error: true,
            message: "Invalid Access Token!"
          });
        } else {
          request.decoded = decoded;
          next();
        }
      });
    } else {
      return reply.code(401).send({
        success: 0,
        message: "Access Denied! Unauthorized User"
      });
    }
  }

module.exports = {
  checkToken
};