const express = require("express");
const NodeCache = require("node-cache");

const app = express();

// In-memory database - Cache in memory (Save in RAM)
const cache = new NodeCache();

// get value from body json
app.use(express.json());

const databases = {
  duchanhstyle: "123456",
  admin: "123456q",
};

const otpGen = () => {
  return Math.floor(Math.random() * 1000000);
};

// login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (databases[username] === password) {
    const otp = otpGen();

    // save otp to cache
    cache.set(username, otp, 60);
    cache.set(username + "_login", 3, 60);

    // send otp to user

    console.log("OTP: ", username, otp);

    return res.json({
      msg: "Please check your OTP",
    });
  }
  return res.json({
    msg: "Login failed",
  });
});

// verify otp
app.post("/verify", (req, res) => {
  const { username, otp } = req.body;
  if (username === undefined || otp === undefined) {
    return res.json({
      msg: "Username or OTP is undefined",
    });
  }
  // check tries of user
  const loginCount = cache.get(username + "_login");
  if (loginCount === undefined || loginCount == 0) {
    cache.del(username);
    cache.del(username + "_login");
    return res.json({
      msg: "OTP is expired",
    });
  }
  cache.set(username + "_login", loginCount - 1, 60);

  // get otp from cache
  const otpFromCache = cache.get(username);

  if (otpFromCache === undefined) {
    return res.json({
      msg: "OTP is expired",
    });
  }

  // check otp of user with otp from cache
  if (otpFromCache == otp) {
    cache.del(username);
    cache.del(username + "_login");

    return res.json({
      msg: "Login success",
    });
  } else {
    return res.json({
      msg: "OTP is not correct",
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    msg: "Hello World",
  });
});

app.listen(3000, () => {
  console.log("Server is running");
});
