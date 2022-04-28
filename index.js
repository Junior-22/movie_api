const express = require("express"),
  morgan = require("morgan");

const app = express();

const bodyParser = require("body-parser"),
  uuid = require("uuid"),
  methodOverride = require("method-override");

const mongoose = require("mongoose");
const Models = require("./models.js");

// mongoose models
const Movies = Models.Movie;
const Users = Models.User;

// connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/movieDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan("common"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

// GET requests
app.get("/", (req, res) => {
  res.send("Hi there, welcome to my movie app!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//Return a list of ALL movies to the user
app.get("/movies", (req, res) => {
  Movies.find()
    .then(movies => {
      res.status(200).json(movies);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return movie by title
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then(movie => {
      res.status(200).json(movie);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return movie by genre
app.get("/movies/genre/:genreName", (req, res) => {
  Movies.find({ "Genre.Name": req.params.genreName })
    .then(movie => {
      res.status(200).json(movie);
    })
    .catch(err => {
      console.error(err);
      res.status(400).send("Error: " + err);
    });
});

// Return movie by director
app.get("/movies/director/:directorName", (req, res) => {
  Movies.find({ "Director.Name": req.params.directorName })
    .then(movie => {
      res.status(200).json(movie);
    })
    .catch(err => {
      console.error(err);
      res.status(400).send("Error: " + err);
    });
});

// return all users
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

// return a user
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

// Allow new users to register
app.post("/users/register", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then(user => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then(user => {
            res.status(201).json(user);
          })
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
});

// update user info (username)
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
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
});

// deregister account
app.delete("/users/:Username", (req, res) => {
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
});

// add movie to list of favorites
app.post("/users/:Username/movies/:MovieID", (req, res) => {
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
});

// remove movie from list of favorites
app.delete("/users/:Username/movies/:MovieID", (req, res) => {
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
});

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

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("My app is listening on port 8080.");
});
