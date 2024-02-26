require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createNewUser, checkForUser, getHashPassword, deleteUser } = require("./connector");
const { request } = require("express");

const jwt_secret_key = process.env.JWT_SECRET;

// sign  up
const signUp = (request, reply) => {
  const body = request.body;
  const salt = bcrypt.genSaltSync(10);
  body.password = bcrypt.hashSync(body.password, salt);
  createNewUser(body, (err, results) => {
    if (err) {
      return reply.code(500).send({
        error: true,
        message:
          err?.code == "ER_DUP_ENTRY"
            ? "User already exists"
            : "Something went wrong. Please try again later!",
      });
    }
    return reply.code(200).send({
      error: false,
      data: "User has been created successfully!",
    });
  });
};

// User login
const login = async (request, reply) => {
  const body = request.body;
  checkForUser(body, (err, results) => {
    try {
      if (err) {
        return reply.code(500).send({
          error: true,
          message: "User doesn't exists",
        });
      } else if (results?.password) {
        let password = results?.password && bcrypt.compareSync(body?.password, results?.password);
        if (password) {
          results.password = undefined;
          const jsontoken = jwt.sign(
            { user_details: results },
            jwt_secret_key,
            {
              expiresIn: "1h",
            }
          );
          const refreshtoken = jwt.sign(
            { user_details : results },
            jwt_secret_key,
            {
              expiresIn: "3650d",
            }
          );
          return reply.code(200).send({
            error: false,
            message: "login successfully",
            access_token: jsontoken,
            refresh_token: refreshtoken,
            userDetails: results,
          });
        } else {
          return reply.code(500).send({
            error: true,
            data: "Incorrect password",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};

// regenarate token
const regenerateToken = async (request, reply) => {
  const user_details = request.decoded.user_details;
  request.body.email = request.decoded.user_details.email;
  const body = request.body;
  checkForUser(body, (err, results) => {
    try {
      if (err) {
        return reply.code(500).send({
          error: true,
          message: "Invalid Refresh Token",
        });
      } else {
        const jsontoken = jwt.sign(
          { user_details: user_details },
          jwt_secret_key,
          {
            expiresIn: "1h",
          }
        );
        const refreshtoken = jwt.sign(
          { user_details : user_details },
          jwt_secret_key,
          {
            expiresIn: "3650d",
          }
        );
        return reply.code(200).send({
          error: false,
          message: "Token refreshed Successfully!",
          access_token: jsontoken,
          refresh_token: refreshtoken,
        });
      }
    }catch(err){
      console.log(err)
    }
    })
  
};

// get user details
const getUserDetails = async (request,reply) => {
  return reply.code(200).send({
    user_details: request.decoded.user_details
  })
}

// delete user's account
const deleteAccount = async (request, reply) => {
  request.body.id = request.decoded.user_details.id
  const body = request.body;
  getHashPassword(body, (err, results)=>{
    try{
      if(err){
        return reply.code(500).send({
          error: true,
          message: "User Doesn't exists",
        });
      }
      let password = results?.password && bcrypt.compareSync(body?.password, results?.password);
      if(password){
        deleteUser(body, (err,results)=>{
          try{
            if(err){
              return reply.code(500).send({
                error: true,
                message: "Something went wrong. Please try again later!",
              });
            }
            return reply.code(200).send({
              error: true,
              message: "User's Account Deleted Successfully",
            });
          }catch(err){
            console.log(err)
          }
        })
      }else{
        return reply.code(401).send({
          error: true,
          message: "Invalid password!",
        });
      }
    }catch(err){
      console.log(err)
    }
  })
};


module.exports = {
  signUp,
  login,
  regenerateToken,
  getUserDetails,
  deleteAccount,
};
