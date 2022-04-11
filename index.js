const express = require("express"),
  morgan = require("morgan");

const app = express();

const bodyParser = require("body-parser"),
  uuid = require("uuid"),
  methodOverride = require("method-override");

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
    genre: { Name: "Drama" },
    director: "Spike Lee",
    actors:
      "Spike Lee, Denzel Washington, Angela Bassett, Theresa Randle, Delroy Lindo, Kate Vernon, Alber Hall"
  },
  {
    title: "Furious 7",
    year: "2015",
    genre: { Name: "Adventure" },
    director: "James Wan",
    actors:
      "Paul Walker, Tyrese Gibson, Vin Diesel, Michelle Rodriguez, Jason Statham, Dwayne Johnson"
  },
  {
    title: "The Old Guard",
    year: "2020",
    genre: { Name: "Action" },
    director: "Gina Prince-Bythewood",
    actors:
      "Charlize Theron, Chiwetel Ejiofor, Harry Melling, Kiki Layne, Michale Ward, Mette Towley"
  },
  {
    title: "Avengers: Endgame",
    year: "2019",
    genre: { Name: "Action" },
    director: "Anthony Russo, Joe Russo",
    actors:
      "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Jeremy Renner, Don Cheadle"
  },
  {
    title: "Black Panther",
    year: "2018",
    genre: { Name: "Adventure" },
    director: "Ryan Coogler",
    actors:
      "Chadwick Boseman, Michael B. Jordan, Lupita Nyong'o, Letitia Wright, Danai Gurira, Daniel Kaluuya"
  },
  {
    title: "John Wick",
    year: "2014",
    genre: { Name: "Thriller" },
    director: "Chad Stahelski",
    actors:
      "Keanu Reeaves, Ian McShane, Lance Reddick, John Leguizamo, Adrianne Palicki, Michael Nyqvist"
  },
  {
    title: "Wonder Woman 1984",
    year: "2020",
    genre: { Name: "Fantasy" },
    director: "Patty Jenkins",
    actors:
      "Gal Gadot, Chris Pine, Kristen Wiig, Pedro Pascal, Natasha Rothwell, Lynda Carter, Ravi Patel"
  },
  {
    title: "The Lucky One",
    year: "2012",
    genre: { Name: "Romance" },
    director: "Scott Hicks",
    actors:
      "Zack Efron, Taylor Schilling, Blythe Danner, Victor Hayes, Sharon Conley, Joe Chrest"
  },
  {
    title: "Baywatch",
    year: "2017",
    genre: { Name: "Comedy" },
    director: "Seth Gordon",
    actors:
      "Dwayne Johnson, Zack Efron, Kelly Rohrbach, Alexandra Daddario, Priyanka Chopra, David Hasselhoff, Hannibal Buress"
  },
  {
    title: "Fences",
    year: "2016",
    genre: { Name: "Drama" },
    director: "Denzel Washington",
    actors:
      "Denzel Washington, Viola Davis, Stephen McKinley, Jovan Adepo, Russell Hornsby, Saniyya Sidney"
  },
  {
    title: "The Magnificent Seven",
    year: "2016",
    genre: { Name: "Action" },
    director: "Antoine Fuqua",
    actors:
      "Denzel Washington, Ethan Hawke, Chris Pratt, Haley Bennett, Vincent D'Onofrio, Martin Sensmeier"
  },
  {
    title: "Aquaman",
    year: "2018",
    genre: { Name: "Fantasy" },
    director: "James Wan",
    actors:
      "Jason Momoa, Amber Heard, Patrick Wilson, Nicole Kidman, William Dafoe, Yahya Abdul-Mateen II"
  },
  {
    title: "The Equalizer",
    year: "2014",
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
  res.status(200).json(movies);
});
// Return movie by title
app.get("/movies/:title", (req, res) => {
  const title = req.params.title;
  const movie = movies.find(movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("movie not found");
  }
});
// Return movie by genre
app.get("/movies/genre/:genreName", (req, res) => {
  const genreName = req.params.genreName;
  const genre = movies.find(movie => movie.genre.Name === genreName);

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre");
  }
});
// Return movie by director
app.get("/movies/director/:directorName", (req, res) => {
  const directorName = req.params.directorName;
  const director = movies.find(movie => movie.director === directorName);

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("director not found");
  }
});
// Allow new users to register
app.post("/users/register", (req, res) => {
  res.status(201).send("account created");
});
// Allow users to update their user info (username)
app.put("/users/:userName", (req, res) => {
  res.status(200).send("account updated");
});
// Allow existing users to deregister
app.delete("/users/:userName", (req, res) => {
  res.status(200).send("account deleted");
});
// Allow users to add a movie to their list of favorites
app.post("/users/:userName/favourites", (req, res) => {
  res.status(200).send("movie added to favourites");
});
// Allow users to remove a movie from their list of favorites
app.delete("/users/:userName/favourites", (req, res) => {
  res.status(200).send("movie removed from favourites");
});

// morgan requests
app.get("/", (req, res) => {
  res.send("Welcome");
});

app.get("/secreturl", (req, res) => {
  res.send("This url contains secret content");
});

// return static file
app.use(express.static("public"));

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("My app is listening on port 8080.");
});
