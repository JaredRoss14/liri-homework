//Store Dependencies
require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");

//Store keys
var spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);

//Defining variables
var twiterPrompt = inquirer.createPromptModule();

//Provide user with list of choices and capture input
inquirer.prompt([

	{
  	type: "list",
  	message: "What would you like to do?",
  	choices: ["Look up tweets by username", "Learn song information", "Learn movie details", "Manual Override"],
  	name: "command"
 	}

//Asks user for information to provide tweets by username
]).then(function(choice) {
 	if (choice.command === "Look up tweets by username") {
		inquirer.prompt([

			{
				type: "input",
				message: "What twitter account are you looking for?",
				name: "twitterAccount",
			},

			{
				type: "list",
				message: "How many tweets would you like to look up?",
				choices: ["5", "10", "20"],
				name: "tweetQuantity",
			},

		//Takes user information to pull a certain number of tweets from a user		
		]).then(function(inquirerResponse) {
	 			var params = {screen_name: inquirerResponse.twitterAccount, count: parseInt(inquirerResponse.tweetQuantity)};
				client.get('statuses/user_timeline', params, function(error, response) {
					if (!error) {

					//Loops through response length to provide tweets 
						for (var i = 0; i < response.length; i++) {
	          	var time = response[i].created_at;
	          	var tweets = response[i].text;
	          	var user = params.screen_name;
		          console.log("");
		          console.log("");
		          console.log("");
		          console.log("----------------" + time + "--------------------------");
		          console.log("");
		          console.log("@" + user + " tweeted:");
		          console.log("");
		          console.log(tweets);
		          console.log("");
		          console.log("");
		          console.log("");
		        };
		      } 

		      //If error - log error
		      else {
		      	console.log(error);
	     	  };
	  	  });
	  });

	//Prompts user for song name
	} else if (choice.command === "Learn song information") {
		inquirer.prompt([

		{
			type: "input",
			message: "What song would you like information about?",
			name: "songName",
		}

		//Takes user input and searches for track information
		]).then(function(inquirerResponse) {
			spotify.search({type: 'track', query: inquirerResponse.songName, limit: 1})
			.then(function(response) {

				// If no error displays information
				if (!error) {
					var spotifyTrack = response.tracks.items[0]
				  console.log("");
	        console.log("");
	        console.log("----------------" + spotifyTrack.name + "--------------------------");
	        console.log("");
	        console.log("Artist(s): " + spotifyTrack.artists[0].name);
	        console.log("Album: " + spotifyTrack.album.name);
	        console.log("Preview Link: " + spotifyTrack.external_urls.spotify);
	        console.log("");
	        console.log("");
	      } 
				
				// If error - log error
	      else {
	      	console.log(error);
	      }
			})
		});

	//Gather User data for OMDB movie search
	} else if (choice.command === "Learn movie details") {
		inquirer.prompt([

		{
			type: "input",
			message: "What movie would you like information about?",
			name: "movieName",
		}

		//Take user data to search for movie
		]).then(function(inquirerResponse) {
			request('http://www.omdbapi.com/?apikey=trilogy&t=' + inquirerResponse.movieName, function(error, response, body) {
				if (!error) {

					//If no error displays movie information
					var movieObject = JSON.parse(body);
					console.log("");
      		console.log("");
					console.log('body: ' + body); 
					console.log('Title: ' + movieObject.Title); 
					console.log('Year Released: ' + movieObject.Year);
					console.log('IMDB Rating: ' + movieObject.imdbRating);
					console.log('Rotten Tomatoes Rating: ', movieObject.Ratings[1].Value); 
					console.log('Country Produced In: ', movieObject.Country);
					console.log('Language: ', movieObject.Language);   
					console.log('Plot: ', movieObject.Plot); 
					console.log('Actors: ', movieObject.Actors); 
				} 

				//If error - log error
				else {
					console.log('Error: ', error);
					console.log('Status Code: ', response && response.statusCode);
				};
			});
		});

	//Gather data from random.txt
	} else if (choice.command === "Manual Override") {
		fs.readFile("random.txt", "utf-8", function(error, response) {
			if (!error) {

				//If no error, reads text file
				var dataArray = response.split(',');
				var textCommand = dataArray[0];
				var searchData = dataArray[1];
				//Grabs more search terms if there are more than 2 terms
				for (var i = 2; i < dataArray.length; i++) {
					searchData = searchData + "+" + dataArray[i];
				};
				console.log(dataArray, textCommand, searchData)
			}
		})

	}
})