require("dotenv").config(); //initalize dotenv
var Spotify = require('node-spotify-api'); //initalize spotify node api
var moment = require('moment'); //initalize moment
var keys = require("./keys.js"); //grab spotify keys from keys.js
var axios = require('axios'); //initalize axios

var userInput = process.argv[2]; //the user command
var searchTerm = process.argv.slice(3).join(""); //the search term without spaces
var searchString = process.argv.slice(3).join(" ") //the search term with spaces

//create a new spotify object initalized with our spotify API keys
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

//if the command is concert-this
//we use axios to search the bandsintown API to get concert information about the artist the user searches for
if(userInput === "concert-this") {
    
    axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp")
        .then(function(response) {

            //go through all concert evens for the artits and print the information
            for(var i = 0; i < response.data.length; i++) {
                
                console.log("\n" + response.data[i].lineup[0]);
                console.log("Venue name: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);

                //use moment to format the date
                var date = moment(response.data[i].datetime.substring(0, 10), "YYYY-MM-DD").format("MM-DD-YYYY").toString();

                console.log("Date: " + date + "\n");
            }
        });
//if the user types in the command spotify-this-song 
//we use the node spotify api and search for the requested song
//if no song is given the user will be returned infromation about Bohemian Rhapsody by Queen
} else if (userInput === "spotify-this-song") {

    if(searchString === "") {
        searchString = "Bohemian Rhapsody";
    }

    spotify.search({ 
        type: 'track',
        query: searchString
    }).then(function(response) {
        //console.log(response.tracks.items[0]);
        console.log("\nArtist: " + response.tracks.items[0].artists[0].name);
        console.log("Track name: " + response.tracks.items[0].name);
        console.log("Preview: " + response.tracks.items[0].preview_url);
        console.log("Album: " + response.tracks.items[0].album.name + "\n");
    }).catch(function(err){
        console.log(err);
    });
} else if (userInput === "movie-this") {

    axios.get("http://www.omdbapi.com/?t=" + searchString + "&y=&plot=short&apikey=trilogy")
        .then(function(response) {
            console.log("\nMovie title: " + response.data.Title);
            console.log("Release year: " + response.data.Year);
            console.log("IMDB rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].value);
            console.log("Country produced: " + response.data.Country);
            console.log("Language(s): " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors + "\n");
        });
}