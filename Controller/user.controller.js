const User = require("../Model/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let userController = {
    registerUser: async (req, res) => {
        try {
            const { name, email, password, mobile } = req.body;

            console.log(name, email, password, mobile);

            const [userByMail, userByMobile] = await Promise.all([
                User.findOne({ email }),
                User.findOne({ mobile }),
            ]);

            if (userByMail) {
                console.log("User with Email already exists");
                return res.status(409).send({ msg: "User with Email already exists" });
            }

            if (userByMobile) {
                console.log("User with Mobile already exists");
                return res.status(409).send({ msg: "User with Mobile already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 8);

            const user = new User({
                name,
                email,
                password: hashedPassword,
                mobile
            });

            const savedUser = await user.save();
            console.log("Registered successfully");
            return res.status(201).send({ msg: savedUser.name + " has registered successfully" });

        } catch (error) {
            console.log(req.body);
            return res.status(400).send({ errors: error });
        }
    },

    getUserById: async (req, res) => {
        const userId = req.params.id;
        console.log(req.body)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ msg: "Invalid user ID format" });
        }

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send({ msg: "User not found" });
            }

            return res.status(200).send(user);

        } catch (error) {
            console.log(error);
            return res.status(500).send({ errors: error });
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            return res.status(200).send(users);

        } catch (error) {
            console.log(error);
            return res.status(500).send({ errors: error });
        }
    },

    updateUserById: async (req, res) => {
        const userId = req.params.id;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ msg: "Invalid user ID format" });
        }

        try {
            const user = await User.findByIdAndUpdate(userId, updateData);

            if (!user) {
                return res.status(404).send({ msg: "User not found" });
            }

            return res.status(200).send({ msg: "User updated successfully", user });

        } catch (error) {
            console.log(error);
            return res.status(400).send({ errors: error });
        }
    },

    deleteUserById: async (req, res) => {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ msg: "Invalid user ID format" });
        }

        try {
            const user = await User.findByIdAndDelete(userId);

            if (!user) {
                return res.status(404).send({ msg: "User not found" });
            }

            return res.status(200).send({ msg: "User deleted successfully" });

        } catch (error) {
            console.log(error);
            return res.status(500).send({ errors: error });
        }
    }
};

module.exports = { userController };
