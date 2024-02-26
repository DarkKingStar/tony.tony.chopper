const { login, signUp, deleteAccount, regenerateToken, getUserDetails } = require("../src/Injector/auth");
const { checkToken } = require("../utils/Authentication");

const postRoutesNoAuth = [
    {
        route:'/user/login',
        postFuntion: login,
    },
    {
        route:'/user/signup',
        postFuntion: signUp,
    },
]

const postRoutesAuth = [
    {
        route:'/user/refresh-token',
        postFuntion: regenerateToken,
        authFunction: checkToken
    },
    {
        route:'/user/userinfo',
        postFuntion: getUserDetails,
        authFunction: checkToken
    },
    {
        route:'/user/delete',
        postFuntion: deleteAccount,
        authFunction: checkToken
    }
]

module.exports = {
    postRoutesNoAuth,
    postRoutesAuth
}