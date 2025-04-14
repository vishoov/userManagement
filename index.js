const express = require("express");
const app = express(); //routing api design structure
const mongoose = require("mongoose"); //data validation
const dotenv = require("dotenv"); //environment variables

dotenv.config();
app.use(express.json()); //for parsing application/json



//this mongoose.connect is used to connect to the mongodb database
//it takes the uri of the database as a parameter
//and returns a promise
//that resolves when the connection is successful
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=> {
    console.error("Error connecting to MongoDB", err);
})
const PORT = process.env.PORT ||3000;
const userRoutes = require("./routes/user.routes");



app.get("/", (req, res)=>{
    res.status(200).sendFile(__dirname + "/index.html");
});


//user routes
app.use("/", userRoutes);

//port listener
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})