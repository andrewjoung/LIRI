# LIRI
LIRI Node Assignment

## Author
Andrew Joung

## Description
This is a node command line application that will take user commands and return information based on what the command is.
The user has an option to search concerts based on an artist, a song on spotify, or a movie.
Information will be logged onto the console as well as a log.txt file.
The user also has an option to read commands from a random.txt file that is provided and email the log.txt to a given email.
This application uses the bandsintown API, the node Spotify API, as well as the OMDB API.

## Instructions

1. Clone the repository 
2. `npm install` to install all necessary dependencies
    * For this application we use node-spotify-api, axios, fs, and nodemailer
3. From the directory of the repository the user can execute the following commands:
    * `node liri.js concert-this <artist>`
        * this will search the bandsintown API and give concert information about the given artist
    * `node liri.js spotify-this-song <song>`
        * this will use the Spotify API to give the user information about the given song
    * `node liri.js movie-this <movie>`
        * this will use the OMDb API to give the user information about the given movie
    * `node liri.js mail-log <email>`
        * this will use nodemailer package to email the log.txt file to the given email

## Screenshots

![screenshot 1](/images/screenshot1.png)
![screenshot 2](/images/screenshot2.png)
![screenshot 3](/images/screenshot3.png)
![screenshot 4](/images/screenshot4.png)
