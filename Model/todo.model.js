const mongoose = require('mongoose')

let todoSchema = mongoose.Schema({
     task:{
        type:String,
        required:true
     },
     status:{
        type:Boolean,
        required:true,
        default:false
     },
     priority:{
        type:String,
        enum: ["High", "Low"],
     },
     addedBy:{
      type:String,
      required:true
     },
     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, 
{
    timestamps: true,
    versionKey: false,
}
)

const Todo = mongoose.model("Todo", todoSchema)

module.exports = Todo;