require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var inquirer = require("inquirer");

//File and store keys
var spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);

//Defining variables
var twiterPrompt = inquirer.createPromptModule();
var argTwo = process.argv[2];

//Prompt Choices
inquirer.prompt([{
  	type: "list",
  	message: "What would you like to do?",
  	choices: ["Look up tweets by username", "Learn song information", "Learn movie details", "Manual Override"],
  	name: "command"
 	}
]).then(function(choice){
 		if (choice.command === "Look up tweets by username") {
 			inquirer.createPromptModule([{
	  			type: "input",
    			message: "What twitter account are you looking for?",
					name: "twitterAccount",
				},
				{
	  			type: "list",
    			message: "How many tweets would you like to look up?",
    			choices: ["5", "10", "20"],
					name: "tweetQuantity",
				}]).then(function(inquirerResponse) {
		 			var params = {screen_name: inquirerResponse.twitterAccount, count: parseInt(inquirerResponse.tweetQuantity)};
		
				client.get('statuses/user_timeline', params, function(error, response) {
  				if (!error) { 
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
		        }
		      } else {
		      	console.log(error);
		      }
		    })
		  })
		} else {
			console.log("No Tweets For You!")
		}
})



//  else if (argOne === "spotify-this-song") {

// } else if (argOne === "movie-this") {

// } else if (argOne === "do-what-it-says") {

// } else {
// 	console.log("Invalid Command")
// }