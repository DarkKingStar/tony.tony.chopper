const { sqlPool } = require("../../config/database");
const { ObjectId } = require('mongodb');

// const createNewUser = (data, callBack) => {
//   sqlPool.query(
//     `insert into users(name, email, password, createdAt) 
//               values(?,?,?,?)`,
//     [data.name, data.email, data.password, new Date().toUTCString()],
//     (error, results, fields) => {
//       if (error) {
//         callBack(error);
//       }
//       return callBack(null, results);
//     }
//   );
// };
const createNewUser = async (data, db) => {
  const usersCollection = db.collection('users');
  data.createdAt = new Date().toUTCString();
  try {
    await usersCollection.insertOne(data);
  } catch (error) {
    throw error;
  }
};

// const checkForUser = async (data, callBack) => {
//   sqlPool.query(
//     "SELECT * FROM users WHERE email = ?",
//     [data.email],
//     (error, results, fields) => {
//       if (error) {
//         callBack(error);
//       }
//       if (results.length == 0) {
//         callBack(true);
//       }
//       return callBack(null, results[0]);
//     }
//   );
// };
const checkForUser = async (data, db) => {
  const usersCollection = db.collection('users');
  try {
    const user = await usersCollection.findOne({ email: data.email });
    return user;
  } catch (error) {
    throw error;
  }
};


// const deleteUser = async (data, callBack) => {
//   sqlPool.query(
//     "DELETE FROM users WHERE users.id = ?",
//     [data.id],
//     (error, results, fields) => {
//       if (error) {
//         callBack(error);
//       }
//       return callBack(null, results);
//     }
//   );
// };
const deleteUser = async (userId, db) => {
  const usersCollection = db.collection('users');
  try {
    await usersCollection.deleteOne({ _id: userId });
  } catch (error) {
    throw error;
  }
};


// const getHashPassword = async (data,  callBack)  => {
//   sqlPool.query(
//     "SELECT password FROM users WHERE users.id = ?",
//     [data.id],
//     (error, results, fields) => {
//       if (error) {
//         callBack(error);
//       }
//       if (results.length == 0) {
//         callBack(true);
//       }
//       return callBack(null, results[0]);
//     }
//   );
// }
const getUserInfo = async (userId, db) => {
  const usersCollection = db.collection('users');
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createNewUser,
  checkForUser,
  getUserInfo,
  deleteUser,
};
