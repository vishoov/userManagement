const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //for hashing the password

const userSchema = new mongoose.Schema({
    //fields : { specifications }

    name:{
        type: String,  
        require:true, //name is required and without name we can't create a user
        trim:true, //remove extra spaces from the name //virat kohli

    },
    email:{
        type:String, //viratkohli@gmail.com
        required:true,
        unique:true, //validation of user, id and it is always unqiue
        trim:true,
        lowercase:true, //convert email to lowercase
        //validation of email 
        //the email should be in correct format 
        validate:{
            validator:function(value){
                //regex to validate the email
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                //viratkohli@gmail.com virat@kohli
                return regex.test(value); //true or false
            },
            message: function(){
                return "Please enter a valid email address";
            }

        } //validation of email

    },
    password:{
        type:String, 
        required:true,
        trim:true,
        minLength:8, //minimum length of password is 8
        maxLength:20, //maximum length of password is 20
        
    },
    age:{
        type:Number,
        required:true,
        min:1, //minimum age is 1
        max:100, //maximum age is 100
        
    },
    role:{
        type:String,
        enum:["user", "admin"], //user or admin //enum is used to define the valid
        //values for the field 
        default:"user" //default role is user

    }

});

//here is the place where we encrypt the password 
userSchema.pre('save', async function(next){
    try{
        if(!this.isModified('password')){
            return next(); //if the password is not modified, then skip the hashing
        }
        const salt = await bcrypt.genSalt(10); //generate a salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt);
        //this.password is the password field in the userSchema
        next();

    }
    catch(err){
        console.error("Error in hashing the password", err);
        next(err); //pass the error to the next middleware
    }

})
//user schema method -> act like a middleware 

userSchema.methods.comparePassword= async function(candidatePassword){
    
    return await bcrypt.compare(candidatePassword, this.password);
    //candidatePassword is the password that user enters while logging in
    //this.password is the hashed password stored in the database
    //bcrypt.compare() compares the candidatePassword with the hashed password
    //and returns true or false
    
}


const User = mongoose.model("User", userSchema); //User is the name of the model and userSchema is the schema

module.exports = User; //export the model to use in other files