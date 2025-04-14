const express = require("express");
const router = express.Router();
// const User = require("../models/User.model");
const { registerRoute, loginRoute, getAllUsers } = require("../controllers/users.controller");

router.post("/register", registerRoute);
router.post("/login", loginRoute);
router.get("/users", getAllUsers);
// router.get("/:id", getUserById);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);


module.exports = router;

