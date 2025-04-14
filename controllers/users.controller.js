const User = require("../models/user.model"); //import the user model

const registerRoute = async (req, res)=>{
    try{
    const user = req.body;//we extract the data from the json that have recieved
    //in the request

    // const newUser = await new User(user); //create a new user object
    const newUser = await User.create(user);
    res.status(201).send(`User ${newUser.name} registered successfully`); //send the response
    }
    catch(err){
        res.status(500).send("Error in registering the user"); //if there is an error in registering the user
    }
}


const loginRoute = async (req, res)=>{

    try{
    const { email, password } = req.body;
    //username, password or email password 
    const user = await User.findOne({email:email});
     
    if(!user){
        return res.status(404).send("User not found"); //if user is not found
    }

    //error handle and if the user doesnt exist throw the error

    if(user.password !== password){
        return res.status(401).send("Invalid password"); //if password is not correct
    }


    //if the password does not match -> password invalid 


    res.status(201).send(`Logged in successfuly as ${user.name}`); //send the response
}
catch(err){
    res.status(500).send("Error in logging in the user"); //if there is an error in logging in the user
}

}


const getAllUsers = async (req, res)=>{

    try{
    
    const users = await User.find({}); //find all the users in the database

    res.status(200).json(users); //send the response
    }
    catch(err){
        res.status(500).send("Error in getting the users"); //if there is an error in getting the users
    }
}


module.exports = { registerRoute, loginRoute, getAllUsers };