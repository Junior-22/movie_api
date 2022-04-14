const express = require("express"),
  morgan = require("morgan");

const app = express();

const bodyParser = require("body-parser"),
  uuid = require("uuid"),
  methodOverride = require("method-override");

const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost27017/movieDB", {
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

let movies = [
  {
    title: "Malcolm X",
    year: "1992",
    description:
      "Biographical epic of the controversial and influential Black Nationalist leader, from his early life and career as a small-time gangster, to his ministry as a member of the Nation of Islam.",
    genre: { Name: "Drama" },
    director: "Spike Lee",
    actors:
      "Spike Lee, Denzel Washington, Angela Bassett, Theresa Randle, Delroy Lindo, Kate Vernon, Alber Hall"
  },
  {
    title: "Furious 7",
    year: "2015",
    description:
      "Dominic Toretto, Brian O'Conner, and the rest of their team have returned to the United States to live normal lives after securing amnesty for their past crimes, until Deckard Shaw, a rogue special forces assassin seeking to avenge his comatose younger brother, puts the team in danger once again.",
    genre: { Name: "Adventure" },
    director: "James Wan",
    actors:
      "Paul Walker, Tyrese Gibson, Vin Diesel, Michelle Rodriguez, Jason Statham, Dwayne Johnson"
  },
  {
    title: "The Old Guard",
    year: "2020",
    description:
      "A covert team of immortal mercenaries is suddenly exposed and must now fight to keep their identity a secret just as an unexpected new member is discovered.",
    genre: { Name: "Action" },
    director: "Gina Prince-Bythewood",
    actors:
      "Charlize Theron, Chiwetel Ejiofor, Harry Melling, Kiki Layne, Michale Ward, Mette Towley"
  },
  {
    title: "Avengers: Endgame",
    year: "2019",
    description:
      "twenty-three days after Thanos killed half of all life in the universe, Carol Danvers rescues Tony Stark and Nebula from deep space and they reunite with the remaining Avengers",
    genre: { Name: "Action" },
    director: "Anthony Russo, Joe Russo",
    actors:
      "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Jeremy Renner, Don Cheadle"
  },
  {
    title: "Black Panther",
    year: "2018",
    description:
      "After the death of his father, T'Challa returns home to the African nation of Wakanda to take his rightful place as king.",
    genre: { Name: "Adventure" },
    director: "Ryan Coogler",
    actors:
      "Chadwick Boseman, Michael B. Jordan, Lupita Nyong'o, Letitia Wright, Danai Gurira, Daniel Kaluuya"
  },
  {
    title: "John Wick",
    year: "2014",
    description:
      "John is a legendary hitman who had retired until a gang invades his house, steals his car, and kills the puppy that his late wife Helen had given him.",
    genre: { Name: "Thriller" },
    director: "Chad Stahelski",
    actors:
      "Keanu Reeaves, Ian McShane, Lance Reddick, John Leguizamo, Adrianne Palicki, Michael Nyqvist"
  },
  {
    title: "Wonder Woman 1984",
    year: "2020",
    description:
      "Set in 1984 during the Cold War, the film follows Diana and her past love Steve Trevor as they face off against Maxwell Lord and Cheetah.",
    genre: { Name: "Fantasy" },
    director: "Patty Jenkins",
    actors:
      "Gal Gadot, Chris Pine, Kristen Wiig, Pedro Pascal, Natasha Rothwell, Lynda Carter, Ravi Patel"
  },
  {
    title: "Fences",
    year: "2016",
    description:
      "A film about an emotionally damaged man who struggles with his past while at the same time trying to provide for his family.",
    genre: { Name: "Drama" },
    director: "Denzel Washington",
    actors:
      "Denzel Washington, Viola Davis, Stephen McKinley, Jovan Adepo, Russell Hornsby, Saniyya Sidney"
  },
  {
    title: "The Magnificent Seven",
    year: "2016",
    description:
      "Seven gunmen from a variety of backgrounds are brought together by a vengeful young widow to protect her town from the private army of a destructive industrialist.",
    genre: { Name: "Action" },
    director: "Antoine Fuqua",
    actors:
      "Denzel Washington, Ethan Hawke, Chris Pratt, Haley Bennett, Vincent D'Onofrio, Martin Sensmeier"
  },
  {
    title: "Aquaman",
    year: "2018",
    description:
      "A half-Atlantean, half-human who is reluctant to be king of the undersea nation of Atlantis. He is a member of the Justice League.",
    genre: { Name: "Fantasy" },
    director: "James Wan",
    actors:
      "Jason Momoa, Amber Heard, Patrick Wilson, Nicole Kidman, William Dafoe, Yahya Abdul-Mateen II"
  },
  {
    title: "The Equalizer",
    year: "2014",
    description:
      "A man who believes he has put his mysterious past behind him cannot stand idly by when he meets a young girl under the control of ultra-violent Russian gangsters.",
    genre: { Name: "Thriller" },
    director: "Antoine Fuqua",
    actors:
      "Denzel Washington, Chloe Grace Moretz, Bill Pullman, Haley Bennett, Marton Csokas"
  }
];

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
  Movies.findOne({ Title: req.params.Title })
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
  Movies.findOne({ "Genre.Name": req.params.Name })
    .then(movie => {
      res.status(200).json(movie.Genre);
    })
    .catch(err => {
      console.error(err);
      res.status(400).send("Error: " + err);
    });
});

// Return movie by director
app.get("/movies/director/:directorName", (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name })
    .then(movie => {
      res.status(200).json(movie.Director);
    })
    .catch(err => {
      console.error(err);
      res.status(400).send("Error: " + err);
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
app.put("/users/:userName", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    }
  ),
    { new: true }, // makes sure that the updated document is returned
    (err, updateUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updateUser);
      }
    };
});

// deregister account
app.delete("/users/:userName", (req, res) => {
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
app.post("/users/:userName/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $push: { FavouriteMovies: req.params.MovieID } }
  ),
    { new: true },
    (err, updateUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updateUser);
      }
    };
});

// remove movie from list of favorites
app.delete("/users/:userName/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull: { FavouriteMovies: req.params.MovieID } }
  ),
    { new: true },
    (err, updateUser) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updateUser);
      }
    };
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
