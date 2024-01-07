const connectToMongo = require("./db")
connectToMongo();
const port = 5000
const express = require('express')


const app = express()
var cors = require("cors")
app.use(cors())
app.use(express.json())



app.use("/api/user", require("./routes/user"));
app.use("/api/group", require("./routes/group"));
app.use("/api/expense", require("./routes/expense"));


app.listen(port, ()=>{
    console.log(`Server started succesfully at ${port}`);
})