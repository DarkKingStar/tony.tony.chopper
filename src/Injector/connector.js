const { sqlPool } = require("../../config/database");

const createNewUser = (data, callBack) => {
  sqlPool.query(
    `insert into users(name, email, password, createdAt) 
              values(?,?,?,?)`,
    [data.name, data.email, data.password, new Date().toUTCString()],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const checkForUser = async (data, callBack) => {
  sqlPool.query(
    "SELECT * FROM users WHERE email = ?",
    [data.email],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      if (results.length == 0) {
        callBack(true);
      }
      return callBack(null, results[0]);
    }
  );
};

const deleteUser = async (data, callBack) => {
  sqlPool.query(
    "DELETE FROM users WHERE users.id = ?",
    [data.id],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results);
    }
  );
};

const getHashPassword = async (data,  callBack)  => {
  sqlPool.query(
    "SELECT password FROM users WHERE users.id = ?",
    [data.id],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      if (results.length == 0) {
        callBack(true);
      }
      return callBack(null, results[0]);
    }
  );
}

module.exports = {
  createNewUser,
  checkForUser,
  deleteUser,
  getHashPassword,
};
