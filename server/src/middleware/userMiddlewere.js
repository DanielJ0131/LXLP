import UsersModel from "../model/UsersModel.js";   
   
const UserMiddleware = {}

UserMiddleware.getUserByToken = async () => {
     return (req, res, next) => {
         try{
             const username = res.locals.jwt.username;
             const user = UsersModel.getUserByUsername(username);
             return user;
         }
         catch (error) {
             next(error);
         }
     }
}


export default UserMiddleware;