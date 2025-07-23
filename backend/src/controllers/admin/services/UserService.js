import {ObjectId} from "mongodb";
import {getDB} from "../../../config/mongodb.js";
import {ApplicationError} from "../../../errorHandle/error.js";
import bcrypt from "bcryptjs";

/**
 * Responsible for the User creation and Management of the Admin users . 
 */
class UserService{
    constructor(){
        this.collection = "User";

    }
    async createUser ( data ){
          
    }
}

export default UserService;