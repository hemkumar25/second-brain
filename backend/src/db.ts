import { model, Schema } from  "mongoose"


const userSchema = new Schema({
    username : {type:String , required: true, unique:true},
    email : { type: String , unique:true },
    password : String
})

const UserModel = model( "user", userSchema)

export { UserModel }