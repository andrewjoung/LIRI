require("dotenv").config(); //initalize dotenv
var Spotify = require('node-spotify-api'); //initalize spotify node api
var moment = require('moment'); //initalize moment
var keys = require("./keys.js"); //grab spotify keys from keys.js
var axios = require('axios'); //initalize axios
var fs = require('fs');
var nodemailer = require('nodemailer'); //for emailing

var userInput = process.argv[2]; //the user command
var searchString = process.argv.slice(3).join(" ") //the search term with spaces

//create a new spotify object initalized with our spotify API keys
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

//if user command is do-what-it-says
//we will read from random.txt and execute the commands found in that text file
if (userInput === "do-what-it-says") {

    //we use the node fs library to read files 
    fs.readFile("random.txt", "utf8", function(err, data){
        //if there is an error return the error
        if(err) {
            return console.log(err);
        }

        var dataArr = data.split("\n")
        console.log(dataArr);

        //loop through it and execute each command
        for(var i = 0; i < dataArr.length; i++) {
            var searchArr = dataArr[i].split(",");
            userInput = searchArr[0];
            searchString = searchArr[1].substring(1, searchArr[1].length - 1); //get rid of the quotes because it doesnt work for concert-this
            console.log(searchString);
            mainFunction();
        }

    });
//else if it is another command we will go to main function and execute the appropriate command
} else {
    mainFunction();
}

//helper method that checks what the command is and does the appropriate task
function mainFunction() {
    //if the command is concert-this
    //we use axios to search the bandsintown API to get concert information about the artist the user searches for
    if(userInput === "concert-this") {
        
        axios.get("https://rest.bandsintown.com/artists/" + searchString + "/events?app_id=codingbootcamp")
            .then(function(response) {
                console.log("https://rest.bandsintown.com/artists/" + searchString + "/events?app_id=codingbootcamp");
                //go through all concert evens for the artits and print the information
                for(var i = 0; i < response.data.length; i++) {

                    //use moment to format the date
                    var date = moment(response.data[i].datetime.substring(0, 10), "YYYY-MM-DD").format("MM-DD-YYYY").toString();

                    //create a string that we can write to a file that will have readable spacing
                    var displayString = "\n\n" + response.data[i].lineup[0] + "\nVenue name: " + response.data[i].venue.name
                    + "\nLocation: " + response.data[i].venue.city + ", " + response.data[i].venue.region + "\nDate: " + date + "\n\n";

                    console.log(displayString);
                    writeToFile(displayString);

                }
            }).catch(function(err){
                console.log(err);
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
            var displayString = "\n\nArtist: " + response.tracks.items[0].artists[0].name + "\nTrack name: " + response.tracks.items[0].name
                                + "\nPreview: " + response.tracks.items[0].preview_url + "\nAlbum: " + response.tracks.items[0].album.name + "\n\n";
            console.log(displayString);
            writeToFile(displayString);

        }).catch(function(err){
            console.log(err);
        });
    } else if (userInput === "movie-this") {

        if(searchString === "") {
            return console.log('If you have watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/');
        }

        axios.get("http://www.omdbapi.com/?t=" + searchString + "&y=&plot=short&apikey=trilogy")
            .then(function(response) {

                var displayString = "\n\nMovie title: " + response.data.Title
                                    + "\nRelease year: " + response.data.Year
                                    + "\nIMDB rating: " + response.data.imdbRating
                                    + "\nRotten Tomatoes rating: " + response.data.Ratings[1].value
                                    + "\nCountry produced: " + response.data.Country
                                    + "\nLanguage(s): " + response.data.Language
                                    + "\nPlot: " + response.data.Plot
                                    + "\nActors: " + response.data.Actors + "\n\n";
                
                console.log(displayString);
                writeToFile(displayString);
            });
    } else if (userInput === "mail-log") {
        email();
        email().catch(console.error);
    }
}

//function that will write the results of the command/search into a log.txt file
function writeToFile(stringToWrite) {
    fs.appendFile("log.txt", stringToWrite, function(err){
        if(err) {
            return console.log(err);
        }

        //console.log("The results have been successfully logged");
    });
}

//bonus task from Trae:
//if user command is mail-log, email the log.txt file to the given email address
//returns an ethereal url where you can view the email
//doesn't actually email to inbox
async function email() {
    console.log("in this funciton");
    var testAccount = await nodemailer.createTestAccount();

    var transporter = nodemailer.createTransport({
        host:"smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    var message = {
        from: 'andrew.joung@gmail.com',
        to: searchString,
        subject: 'Results',
        text: 'See the attatchment',
        attachments: [
            {
                filename: 'log.txt',
                path: './log.txt'
            }
        ]
    }
    var info = await transporter.sendMail(message);
    console.log(nodemailer.getTestMessageUrl(info));
}