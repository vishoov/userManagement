const express = require("express");
const app = express(); //routing api design structure
const mongoose = require("mongoose"); //data validation
const dotenv = require("dotenv"); //environment variables
const rateLimit = require("express-rate-limit"); //rate limiting to prevent brute force attacks
const helmet = require("helmet"); //security middleware to set various HTTP headers




app.use(helmet()); //use helmet to set security headers

dotenv.config();
app.use(express.json()); //for parsing application/json

const limiter = rateLimit({
    //maximum number of requests per IP address
    //time window 
    //standard header for rate limiting
    //legacy header for rate limiting 
    windowMs: 30 * 60 * 1000, //30 minutes
    max:5, //limit each IP to 100 requests per windowMs
    standardHeaders: true, //return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, //disable the `X-RateLimit-*` headers
    message: "Too many requests, please try again later." //message to be sent when the limit is exceeded
})

app.use(limiter); //apply the rate limiting middleware to all requests
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