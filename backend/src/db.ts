import { model, Schema, Types } from  "mongoose"


const userSchema = new Schema({
    username : {type:String , required: true, unique:true},
    email : { type: String , unique:true },
    password : String
})

const contentSchema = new Schema({
    title:String,
    link: String,
    tag:[{type:Types.ObjectId, ref:'Tag'}],
    userId: {type:Types.ObjectId, ref:'user', required:true}

})

const linkSchema = new Schema({
    hash:String,
    userId: {type:Types.ObjectId, ref:'user', required:true}
})

const UserModel = model( "user", userSchema)
const contentModel = model("content", contentSchema) 
const linkModel = model("link", linkSchema)

export { 
    UserModel,
    contentModel,
    linkModel
}