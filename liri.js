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
  var client = new Twitter({
    consumer_key: tweetKeys.consumer_key,
    consumer_secret: tweetKeys.consumer_secret,
    access_token_key: tweetKeys.access_token_key,
    access_token_secret: tweetKeys.access_token_secret
  });

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
      console.log("**********************************************************");
      console.log("Artist: " + data.tracks.items[j].album.artists[0].name);
      console.log("Song Title: " + data.tracks.items[j].name); // Title of the song
      console.log("Album: " + data.tracks.items[j].album.name);
      console.log("Spotify preview link: " + data.tracks.items[j].preview_url);  // Quick preview URL
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
      console.log("Movie Title: " + JSON.parse(body).Title);
      console.log("Released: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Produced in: " + JSON.parse(body).Country);
      console.log("Language(s): " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("Website: " + JSON.parse(body).Website);
    }
  });

}

// random() function using fs Node package to use random.txt to call spotify-this-song command
function random() {

  var fs = require('fs');

  fs.readFile('random.txt', 'utf-8', function(err, data) {
    data = data.split(',');
    console.log(data);

  

  });

}


