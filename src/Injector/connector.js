const { ObjectId } = require('mongodb');


const createNewUser = async (data, db) => {
  const usersCollection = db.collection('users');
  data.createdAt = new Date().toUTCString();
  try {
    await usersCollection.insertOne(data);
  } catch (error) {
    throw error;
  }
};


const checkForUser = async (data, db) => {
  const usersCollection = db.collection('users');
  try {
    const user = await usersCollection.findOne({ email: data.email });
    return user;
  } catch (error) {
    throw error;
  }
};



const deleteUser = async (userId, db) => {
  const usersCollection = db.collection('users');
  try {
    await usersCollection.deleteOne({ _id: new ObjectId(userId) });
  } catch (error) {
    throw error;
  }
};


const getUserInfo = async (userId, db) => {
  const usersCollection = db.collection('users');
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    user.password = undefined;
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
