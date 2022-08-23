// has to be the same key used in the JWTStrategy in passport file
const jwtSecret = "your_jwt_secret";

const jwt = require("jsonwebtoken"),
  passport = require("passport");

// requires the local passport file
require("./passport");

let generateJWTToken = user => {
  return jwt.sign(user, jwtSecret, {
    // username to encode in JWT
    subject: user.Username,
    // duration for token to expire
    expiresIn: "7d",
    // used to sign/encode JWT values
    algorithm: "HS256"
  });
};

/**
 *authenticate and login a user
 */
module.exports = router => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
          error: error
        });
      }
      req.login(user, { session: false }, error => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
