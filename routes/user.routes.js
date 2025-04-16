const express = require("express");
const router = express.Router();
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

router.post("/register", registerRoute);
router.post("/login", loginRoute);
router.get("/users", getAllUsers);
router.get("/users/:id", getId);
router.put("/users/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/age", getUsersByAge);
router.get("/search/emails", getEmails)
//aggregation pipelines or aggregation queries to analyse the data, predict trends 
//and implement efficient data processing



module.exports = router;

