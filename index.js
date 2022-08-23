const express = require("express"),
  morgan = require("morgan");

const app = express();

const bodyParser = require("body-parser"),
  uuid = require("uuid"),
  methodOverride = require("method-override");

// requires the Mongoose package and the Mongoose Models created in models.js
const mongoose = require("mongoose");
const Models = require("./models.js");

// mongoose models
const Movies = Models.Movie;
const Users = Models.User;

const cors = require("cors");
app.use(cors());

// requires express validator to validate user input on the server side
const { check, validationResult } = require("express-validator");

// // connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/movieDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// connect to MongoDB Atlas
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan("common"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// import the auth.js file into the project
let auth = require("./auth")(app);

// requires the Passport module and imports passport.js
const passport = require("passport");
require("./passport");

app.use(bodyParser.json());
app.use(methodOverride());

/**
 * redirects route to index.html
 * @param {express.request} req
 * @param {express.response} res
 */
app.get("/", (req, res) => {
  res.send("Hi there, welcome to my movie app!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

/**
 * Return a list of ALL movies to the user
 * /movies end-point
 * method: get
 * get all movies
 * @param {express.request} req
 * @param {express.response} res
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then(movies => {
        res.status(200).json(movies);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Return movie by title
 * /movies/:title end-point
 * method: gt
 * movies by title
 * @param {express.request} req
 * @param {express.response} res
 */
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then(movie => {
        res.status(200).json(movie);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Return movie by genre
 * //movies/genre/:genreName end-point
 * method: get
 * get description of a genre by name
 * @param {express.request} req
 * @param {express.response} res
 */
app.get(
  "/movies/genre/:genreName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ "Genre.Name": req.params.genreName })
      .then(movie => {
        res.status(200).json(movie);
      })
      .catch(err => {
        console.error(err);
        res.status(400).send("Error: " + err);
      });
  }
);

/**
 * Return movie by director
 * /movies/director/:directorName end-point
 * method: get
 * director by name
 * @param {express.request} req
 * @param {express.response} res
 */
app.get(
  "/movies/director/:directorName",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ "Director.Name": req.params.directorName })
      .then(movie => {
        res.status(200).json(movie);
      })
      .catch(err => {
        console.error(err);
        res.status(400).send("Error: " + err);
      });
  }
);

/**
 * Return all users
 * /users end-point
 * method: get
 * get all user profiles
 * @param {express.request} req
 * @param {express.response} res
 */
app.get("/users", (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * Return a user
 * /users/:Username end-point
 * method: get
 * get user by username
 * @param {express.request} req
 * @param {express.response} res
 */
app.get("/users/:Username", (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * Allow new users to register
 * /users/register end-point
 * method: post
 * register user profile
 * expects Username, Password, Email, Birthday
 * @param {express.request} req
 * @param {express.response} re
 */
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post(
  "/users/register",
  // validation logic
  [
    check("Username", "Username is required").isLength({ min: 4 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required")
      .not()
      .isEmpty(),
    check("Email", "Email not valid").isEmail()
  ],
  (req, res) => {
    // check validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // hashes any password entered by the user when registering before storing it in the MongoDB database
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then(user => {
        // if user already exists, this message will be returned
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          // if user does not exist, it will create a new user document in Users collection
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            // this callback takes the created document as a parameter, in this case named user.
            // it will give the client feddback on the transaction, letting them know that it's been completed
            .then(user => {
              res.status(201).json(user);
            })
            // catch() function that will catch any problems that
            //Mongoose encounters while running the create commmand
            .catch(error => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
 * update user info
 * /users/:Username end-point
 * method: put
 * update user's profile
 * @param {express.request} req
 * @param {express.response} res
 */
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 4 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed"
    ).isAlphanumeric(),
    check("Password", "Password is required")
      .not()
      .isEmpty(),
    check("Email", "Email not valid").isEmail()
  ],
  (req, res) => {
    // check validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }, // makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * deregister account
 * /users/:Username end-point
 * method: delete
 * delete user's profile
 * @param {express.request} req
 * @param {express.response} res
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(user => {
        if (!user) {
          res.status(400).send(req.params.Username + "not found");
        } else {
          res.status(200).send(req.params.Username + "account deleted");
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * add movie to list of favorites
 * /users/:Username/movies/:MovieID end-point
 * method: post
 * add movie to user's favorites
 * @param {express.request} req
 * @param {express.response} res
 */
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavouriteMovies: req.params.MovieID } },

      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * remove movie from list of favorites
 * /users/:Username/movies/:MovieID end-point
 * method: delete
 * delete a movie from user's favorites
 * @param {express.request} req
 * @param {express.response} re
 */
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavouriteMovies: req.params.MovieID } },

      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// // morgan requests
// app.get("/", (req, res) => {
//   res.send("Welcome");
// });
//
// app.get("/secreturl", (req, res) => {
//   res.send("This url contains secret content");
// });
//
// // return static file
// app.use(express.static("public"));

// Error-handling middleware function that will log all application-level errors to the terminal
app.use((err, req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:1234");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", true);
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Server listens to Port 8080. For HTTP Port 80 is the default Port
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("My app is listening on port " + port);
});
