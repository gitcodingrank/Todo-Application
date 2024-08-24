
const User = require("../Model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { blackList } = require("../blackList");

const userAuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).send({ error: "User Not Found" });
      }

      // Compare password asynchronously
      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) {
          return res.status(400).send({ error: err });
        }

        if (!result) {
          return res.status(401).send({ error: "Invalid password" });
        }

        // Generate JWT token if password matches
        const payload = {
          user: {
            id: user.id
          },
        };
        
        let token = jwt.sign(payload, "nethravathi", { expiresIn: "7d" });
        res.status(200).send({
          msg: `${user.name} has logged in successfully`,
          token: token,
        });
      });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  },
  logout: (req, res) => {
    var token = req.headers.authorization.split(" ")[1];
    try {
      blackList.push(token);
      res.status(201).send({ msg: "User has logged out seccessfully" });
    } catch (error) {
      res.status(400).send({ err: error });
    }
  },
};

module.exports = { userAuthController };
