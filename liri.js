// Load fs package to read and write
var fs = require('fs');

// Load request package
var request = require('request');

// Store Twitter Keys into this variable
var keys = require('./keys.js');
var tweetKeys = keys.twitterKeys;

// Variables to store arguments passed to Liri
var command = process.argv[2];
var action = process.argv[3];

// Switch-Case statements for Liri to perform
switch (command) {

  case "my-tweets":
    tweet(); // Run the tweet() function
    break;

  case "spotify-this-song":
    spotify(); // Run the spotify() function
    break;

  case "movie-this":
    movie(); // Run the movie() function
    break;

  case "do-what-it-says":
    random(); // Run the random() function
    break;

}

// tweet() function calling Twitter API
function tweet() {
  // User based authentication
  var Twitter = require('twitter');

  // since you've already named your twitter keys the same as what the Twitter client expects
  // you can simply pass those in instead of redundantly naming them.
  var client = new Twitter(tweetKeys)

  var params = { screen_name: 'tcbtran23', count: 20};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

      for (var i=0; i < tweets.length; i++) {
      console.log("Tweet: " + tweets[i].text);
      console.log("Posted on: " + tweets[i].created_at);
      console.log("==================================");
      }

    }
  });
}

// spotify() function calling Spotify API
function spotify() {
  // doesn't make a functional difference, but it's common place to define all your dependencies
  // at the top of the file as opposed to right before you use them.
  var spotify = require('spotify');
  var nodeArgs = process.argv;
  var song = "";
  for (var i=3; i < nodeArgs.length; i++) {
      song = song + " " + nodeArgs[i];
    }

  spotify.search( {type: 'track', query: song }, function(err, data) {
    if (err) {
      console.log(err);
      return;
    }
    else {
      console.log(data.tracks.items.length + " results were found"); // Number of results found

      for (var j=0; j < data.tracks.items.length; j++) {
        // when you find yourself accessing such a deeply nested piece of data
        // you can go ahead and assign it to a variable for the sake of readability
        var track = data.tracks.items[j]
        // It may seem silly, but consistent indentation makes parsing your code considerably easier
        console.log("**********************************************************");
        console.log("Artist: " + track.album.artists[0].name);
        console.log("Song Title: " + track.name); // Title of the song
        console.log("Album: " + track.album.name);
        console.log("Spotify preview link: " + track.preview_url);  // Quick preview URL
      }

    }
  });

}

// movie() function calling OMDB API
function movie() {

  var request = require('request');

  var nodeArgs = process.argv;
  var movieTitle = "";
  for (var i=3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      movieTitle = movieTitle + "+" + nodeArgs[i];
    }
    else {
      movieTitle += nodeArgs[i];
    }
  }

  var queryURL = "http://www.omdbapi.com/?t=" + movieTitle + "&plot=short&r=json";

  request(queryURL, function(err, response, body) {
    if (err) {
      console.log(err);
    }
    else {
      // Instead of repeatedly parsing the body, you can simply redefine the body as it's parsed result
      // and then you can save yourself a few key strokes and a few computing cycles
      body = JSON.parse(body)

      console.log("Movie Title: " + body.Title);
      console.log("Released: " + body.Year);
      console.log("IMDB Rating: " + body.imdbRating);
      console.log("Produced in: " + body.Country);
      console.log("Language(s): " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Website: " + body.Website);
    }
  });

}

// random() function using fs Node package to use random.txt to call spotify-this-song command
function random() {

  var fs = require('fs');

  fs.readFile('random.txt', 'utf-8', function(err, data) {
    data = data.split(',');
    console.log(data);

    // if you encapsulated the switch command from the top of the file into
    // a function and you modified your spotify and movie functions to take in 
    // the song or movie to search for as an argument, then you could simply
    // call the function containing the switch command here with the command
    // from the random file as well as the string to search for.

  });

}


