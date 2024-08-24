const mongoose = require("mongoose");
require("dotenv").config()

// const password = encodeURIComponent('nethravathi@1234');
//const uri = `mongodb+srv://nethravathitodoapp:${encodeURIComponent('nethravathi@1234')}@cluster0.f4ytf.mongodb.net/todoappdb?retryWrites=true&w=majority&appName=Cluster0`;

let connection = mongoose.connect(process.env.mongoUrl);
module.exports = { connection };

//database credentials:
//username: nethravathitodoapp
//password: nethravathi@1234