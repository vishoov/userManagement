const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); //for creating and verifying JWT tokens
// const User = require("../models/User.model");
const { 
    registerRoute,
    loginRoute, 
    getAllUsers, 
    getId,
    updateUser,
    deleteUser,
    getUsersByAge,
    getEmails
} = require("../controllers/users.controller");

const { authenticateToken } = require("../auth/auth.middleware");


router.post("/register", registerRoute);
router.post("/login", loginRoute);
router.get("/users", authenticateToken, getAllUsers);
router.get("/users/:id", getId);
router.put("/users/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/age", getUsersByAge);
router.get("/search/emails", getEmails)
//aggregation pipelines or aggregation queries to analyse the data, predict trends 
//and implement efficient data processing

router.post("/refreshToken", async (req, res)=>{
    try{
        const { refreshToken } = req.body; //get the refresh token from the request body

        if(!refreshToken){
            return res.status(400).send("Refresh token is required"); //if the refresh token is not present
        }

        //verify the refresh token
        const user = jwt.verify(refreshToken, process.env.JWT_SECRET); //verify the refresh token using the secret key
        
        if(!user){
            return res.status(401).send("Invalid refresh token"); //if the refresh token is not valid
        }
        //expire the token 
        //if the refresh token is valid, we can create a new access token

        //create a new access token
        const newAccessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET, //secret key to sign the token
            {
                expiresIn: '1h', //set the expiration time for the access token
                algorithm: 'HS256' //algorithm to sign the token
            }
        );
        res.status(200).json({
            accessToken: newAccessToken //send the new access token in the response
        });
    }
            
    
    catch(err){
        console.error("Error in refreshing token", err);
        res.status(500).send("Error in refreshing token");
    }
})



module.exports = router;

