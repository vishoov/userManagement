const User = require("../models/user.model"); //import the user model
const { createToken } = require("../auth/auth.middleware"); //import the createToken function from auth middleware
const validator = require("validator"); //import the validator library for data validation
const { xss } = require("xss");


const registerRoute = async (req, res)=>{
    try{
    const user = req.body;//we extract the data from the json that have recieved
    //in the request

    // const newUser = await new User(user); //create a new user object
    const newUser = await User.create(user);

    const token = createToken(newUser); //create a token for the user
    res.status(201).json({
        message:`User ${newUser.name} registered successfully`, //send the response
        user:newUser,
        token:token //send the user object in the response
    }) //send the response
    }
    catch(err){
        res.status(500).send(err); //if there is an error in registering the user
    }
}


const loginRoute = async (req, res)=>{

    try{
    const { email, password } = req.body;

        //review on a product -> review title, de
        //title= xss("<script>alert('xss')</script>") //xss attack


    if(!validator.isEmail(email)){
        return res.status(400).send("Invalid email format"); //if the email is not valid
    }

    //username, password or email password 
    const user = await User.findOne({email:email});

     
    if(!user){
        return res.status(404).send("User not found"); //if user is not found
    }

    //error handle and if the user doesnt exist throw the error


    if(!await user.comparePassword(password)){
        return res.status(401).send("Invalid password"); //if the password does not match 
    }
    //compare the password with the hashed password in the database

    const token = createToken(user); //create a token for the user

    //if the password does not match -> password invalid 


    res.status(201).send(`Logged in successfuly as ${user.name}, ${token}`); //send the response
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

const getId = async (req, res)=>{
    try{
        // const id = req.body.id;
        const id = req.params.id;
        const user = await User.findById(id);

        if(!user){
            return res.status(404).send("User not found"); //if user is not found
        }

        res.status(200).json(user);



        //mongoDB -> find, and findOne 
        //mongoose -> findById, findByIdAndUpdate, findByIdAndDelete

    }
    catch(err){
        res.status(500).send("Error in getting the user"); 
    }
}

const updateUser = async (req, res) =>{
    try{
        //find the user by id and update the user
        const id = req.params.id;

        const newData = req.body; //get the data from the request body

        const updatedUser = await User.findByIdAndUpdate(
            id,// used to identify the user 
            newData, // //data to be updated
            { new: true } //return the updated user
        )

        if(!updatedUser){
            return res.status(404).send("User not found"); //if user is not found
        }

        res.status(200).json(updatedUser);

    }
    catch(err){
        res.status(500).send("Error in updating the user"); 
    }
}

const deleteUser = async (req, res)=>{
    try{
        const id = req.params.id;

        const deletedUser = await User.findByIdAndDelete(id);

        res.status(200).json(deletedUser); //send the response
    }
    catch(Err){
        res.status(500).send("Error in deleting the user");
    }
}


const getUsersByAge = async (req, res)=>{
    
    try{
        console.log("getUsersByAge called");
        //grouped by age and count the number of users in each age group
        //20 -> 5 users, 30 -> 10 users, 40 -> 15 users
        //name, phone, age, phone number, email, password, role
        //age: count
        //age:count

        //aggregation is set of commands -> query, group, project, sort, match, limit, skip
        //we input an array of conditions and stages in the aggregate function, 
        //and they are implemented step by step in the exact same order that they are given in

        const users = await User.aggregate([
            //stage 1 -> group the users by age and count the number of users in each age group 
            {
                // $group is used to group the documents in a collection by a specified field or fields
                $group:{
                    _id:"$age", //group by age 20, 30, 40, 50, 60, 70, 80, 90, 100
                    count: { $sum: 1 } //count the number of users in each age group
                    //20 years document we want the sum of all users in that age group
                    //count the number of users in each age group 
                }
            }, 

            //age:count 
            // 30 : 10, 40 : 15, 20 : 5
            //stage 2 -> sort the users by age in ascending order
            {
                $sort:{
                    //age to be sorted in ascending order
                    _id:1 //1 is used to sort in ascending order and -1 is used to sort in descending order
                    
                }
            },
            //stage 3 - project -> to reshape the documents in the pipeline
            {
                $project:{
                    //  { age:20, count: 10 }
                    _id:0, //exclude the _id field from the output
                    age:"$_id", //include the age field in the output
                    count:1 //include the count field in the output
                }
            }
        ]);

        if (users.length === 0) {
            return res.status(404).send("No users found");
          }
        console.log(users);
        res.status(200).json(users); //send the response
    }
    catch(err){
        res.status(500).send('ahahahah');
    }
}



//http://localhost:3000/search/emails?page=1&limit=10

const getEmails = async (req, res)=>{
    const page = parseInt(req.query.page) || 1; //get the page number from the query string
    const limit = parseInt(req.query.limit) || 10; //get the limit from the query string
    const skip = (page - 1) * limit; //calculate the number of documents to skip

    try{
        console.log("getEmails called");
        const emails = await User.aggregate([
            {
            $project: {
                _id: 0, // exclude the _id field from the output
                email: 1 // include only the email field in the output

            }
            }
        ])
        .skip(skip).limit(limit) //limit the number of emails to 10 and skip the first 0 emails

        //sequentially 

        if (emails.length === 0) {
            return res.status(404).send("No users found");
          }
        console.log(emails);
        res.status(200).json(emails); //send the response
    }
    catch(err){
        res.status(500).send("Error in getting the emails"); //if there is an error in getting the emails
    }
}



module.exports = { registerRoute, loginRoute, getAllUsers, getId, updateUser, deleteUser, getUsersByAge, getEmails };