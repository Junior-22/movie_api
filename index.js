const express = require("express"),
  morgan = require("morgan");

const app = express();

const bodyParser = require("body-parser"),
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
    genre: "Drama",
    director: "Spike Lee",
    actors:
      "Spike Lee, Denzel Washington, Angela Bassett, Theresa Randle, Delroy Lindo, Kate Vernon, Alber Hall"
  },
  {
    title: "2 Fast 2 Furious",
    year: "2003",
    genre: "Action, Crime,Thriller",
    director: "John Singleton",
    actors: "Paul Walker, Tyrese Gibson, Eva Mendes, Cole Hauser"
  },
  {
    title: "The Old Guard",
    year: "2020",
    genre: "Action, Fantasy",
    director: "Gina Prince-Bythewood",
    actors:
      "Charlize Theron, Chiwetel Ejiofor, Harry Melling, Kiki Layne, Michale Ward, Mette Towley"
  },
  {
    title: "Avengers: Endgame",
    year: "2019",
    genre: "Action, Sci-fi",
    director: "Anthony Russo, Joe Russo",
    actors:
      "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Jeremy Renner, Don Cheadle"
  },
  {
    title: "Black Panther",
    year: "2018",
    genre: "Action, Adventure",
    director: "Ryan Coogler",
    actors:
      "Chadwick Boseman, Michael B. Jordan, Lupita Nyong'o, Letitia Wright, Danai Gurira, Daniel Kaluuya"
  },
  {
    title: "John Wick",
    year: "2014",
    genre: "Action, Thriller",
    director: "Chad Stahelski",
    actors:
      "Keanu Reeaves, Ian McShane, Lance Reddick, John Leguizamo, Adrianne Palicki, Michael Nyqvist"
  },
  {
    title: "Wonder Woman 1984",
    year: "2020",
    genre: "Action, Fantasy",
    director: "Patty Jenkins",
    actors:
      "Gal Gadot, Chris Pine, Kristen Wiig, Pedro Pascal, Natasha Rothwell, Lynda Carter, Ravi Patel"
  },
  {
    title: "The Lucky One",
    year: "2012",
    genre: "Romance, Drama",
    director: "Scott Hicks",
    actors:
      "Zack Efron, Taylor Schilling, Blythe Danner, Victor Hayes, Sharon Conley, Joe Chrest"
  },
  {
    title: "Baywatch",
    year: "2017",
    genre: "Comedy, Action",
    director: "Seth Gordon",
    actors:
      "Dwayne Johnson, Zack Efron, Kelly Rohrbach, Alexandra Daddario, Priyanka Chopra, David Hasselhoff, Hannibal Buress"
  },
  {
    title: "Fences",
    year: "2016",
    genre: "Drama, Historical",
    director: "Denzel Washington",
    actors:
      "Denzel Washington, Viola Davis, Stephen McKinley, Jovan Adepo, Russell Hornsby, Saniyya Sidney"
  },
  {
    title: "The Magnificent Seven",
    year: "2016",
    genre: "Western, Action",
    director: "Antoine Fuqua",
    actors:
      "Denzel Washington, Ethan Hawke, Chris Pratt, Haley Bennett, Vincent D'Onofrio, Martin Sensmeier"
  },
  {
    title: "Fury",
    year: "2014",
    genre: "War, Action",
    director: "David Ayer",
    actors:
      "Brad Pitt, Shia Labeouf, Logan Lerman, Michael Pena, Jon Bernthal, Scott Eastwood, Alicia von Rittberg"
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
  res.json(movies);
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
