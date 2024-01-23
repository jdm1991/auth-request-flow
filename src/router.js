const express = require("express");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const router = express.Router();

const mockUser = {
  username: "authguy",
  password: "mypassword",
  profile: {
    firstName: "Chris",
    lastName: "Wolstenholme",
    age: 43,
  },
};

function createToken() {
  try {
    return jwt.sign({ username: mockUser.username }, secret);
  } catch (error) {
    console.error("Error creating token:", error);
    return null;
  }
}

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === mockUser.username && password === mockUser.password) {
    const token = createToken();
    if (token) {
      console.log(token);
      res.status(201).json({ token, message: "Welcome" });
    } else {
      res.status(500).json({ message: "Error creating token" });
    }
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.get("/profile", (req, res) => {
  try {
    const tokenFromAuth = req.headers.authorization;
    if (!tokenFromAuth) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = tokenFromAuth.split(" ")[1];
    jwt.verify(token, secret);
    res.json({ profile: mockUser.profile });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;