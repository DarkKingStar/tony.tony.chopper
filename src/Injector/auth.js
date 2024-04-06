require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createNewUser, checkForUser, getUserInfo, deleteUser } = require("./connector");

const jwt_secret_key = process.env.JWT_SECRET;

// sign  up
const signUp = async (request, reply, db) => {
  try {
    const body = request.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    body.password = await bcrypt.hash(body.password, salt);
    const user = await checkForUser(body, db);
    if (user) {
      return reply.code(200).send({
        error: true,
        message: "User exist! please login.",
      });
    }else{
      await createNewUser(body, db);
      return reply.code(200).send({
        error: false,
        message: 'User has been created successfully!',
      });
    }
  } catch (err) {
    console.log(err);
    return reply.code(200).send({
      error: true,
      message: 'Something went wrong. Please try again later!',
    });
  }
};


// User login

const login = async (request, reply, db) => {
  try {
    const body = request.body;
    const user = await checkForUser(body, db);

    if (!user) {
      return reply.code(200).send({
        error: true,
        message: "User doesn't exist",
      });
    }

    const passwordMatch = bcrypt.compareSync(body.password, user.password);

    if (passwordMatch) {
      // Omit password from the response
      user.password = undefined;

      const jsontoken = jwt.sign({ userDetails: user }, jwt_secret_key, {
        expiresIn: '60s',
      });

      const refreshtoken = jwt.sign({ userDetails: user }, jwt_secret_key, {
        expiresIn: '300s',
      });

      return reply.code(200).send({
        error: false,
        message: 'Login successful',
        access_token: jsontoken,
        refresh_token: refreshtoken,
        userDetails: user,
      });
    } else {
      return reply.code(200).send({
        error: true,
        message: 'Incorrect password',
      });
    }
  } catch (err) {
    console.log(err);
    return reply.code(200).send({
      error: true,
      message: 'Something went wrong. Please try again later!',
    });
  }
};


// regenarate token
const regenerateToken = async (request, reply, db) => {
  const userDetails = request.decoded.userDetails;
  const jsontoken = jwt.sign(
    { userDetails: userDetails },
    jwt_secret_key,
    {
      expiresIn: "60s",
    }
  );
  const refreshtoken = jwt.sign(
    { userDetails : userDetails },
    jwt_secret_key,
    {
      expiresIn: "300s",
    }
  );
  return reply.code(200).send({
    error: false,
    message: "Token refreshed Successfully!",
    access_token: jsontoken,
    refresh_token: refreshtoken,
  });
}
   


// get user details
const getUserDetails = async (request,reply, db) => {
  try{
    const userId = request.body.id;
    const user = await getUserInfo(userId, db);
      if (!user) {
        return reply.code(404).send({
          error: true,
          message: "User doesn't exist!",
        });
      }else{
        return reply.code(200).send({
          userDetails: user
        })
      }
  }catch(err){
    console.log(err);
    return reply.code(500).send({
      error: true,
      message: 'Something went wrong. Please try again later!',
    });
  }
}

// delete user's account
const deleteAccount = async (request, reply, db) => {
  try {
    const userId = request.decoded.userDetails._id;
    const password = request.body.password;
    const user = await getUserInfo(userId, db);
    if (!user) {
      return reply.code(500).send({
        error: true,
        message: "User doesn't exist",
      });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (passwordMatch) {
      await deleteUser(userId, db);
      return reply.code(200).send({
        error: false,
        message: "User's Account Deleted Successfully",
      });
    } else {
      return reply.code(401).send({
        error: true,
        message: "Invalid password!",
      });
    }
  } catch (err) {
    console.log(err);
    return reply.code(500).send({
      error: true,
      message: 'Something went wrong. Please try again later!',
    });
  }
};


module.exports = {
  signUp,
  login,
  regenerateToken,
  getUserDetails,
  deleteAccount,
};
