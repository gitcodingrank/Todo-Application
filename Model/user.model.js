const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }]
}
    ,
    {
        timestamps: true,
        versionKey: false,
    }

)


const User = mongoose.model("User", userSchema)

module.exports = User;