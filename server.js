const express = require('express')
const { connection } = require("./Connection/config");
const {userRouter} = require("./Route/user.route")
const {todoRouter} = require("./Route/todo.route")
const cors = require("cors");
require("dotenv").config()

const app = express()

app.use(express.json());
app.use(cors());
app.use(cors({
  origin: 'https://merry-rugelach-d4ac5f.netlify.app'
}));

app.listen(process.env.PORT, async () =>{
   try {
    await connection
    console.log("Connected")
    console.log("Connected to Database successfully");
    console.log(`Server has started on http://localhost:${process.env.PORT}/`);
   } catch (error) {
     console.log("Error:",error)
   }
})


app.use("/users", userRouter)
app.use("/todos", todoRouter)





