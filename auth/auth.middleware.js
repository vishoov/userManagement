const jwt = require('jsonwebtoken');


//first we will create a middleware function to create a token 

const createToken = (user)=>{
    return jwt.sign(
        {
            id: user._id,
            email:user.email,
        },
        process.env.JWT_SECRET, //secret key to sign the token
        {
            expiresIn:'1h',
            algorithm: 'HS256' //algorithm to sign the token
        }
    )
}

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        console.log("Token:", token); //log the token for debugging
        if(!token){
            return res.status(401).send("Access token is missing"); //if the token is not present
        }

        const user = jwt.verify(token, process.env.JWT_SECRET); //verify the token using the secret key
        console.log("User:", user);

        req.user=user;
        next(); //if the token is valid, proceed to the next middleware or route handler
        
    }
    catch(err){
        res.status(401).send("Unauthorized access"); //if the token is not valid
    }
}



module.exports ={
    createToken,
    authenticateToken
}