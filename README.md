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
    1. '''npm install'' to install all necessary dependencies
        * For this application we use node-spotify-api, axios, fs, and nodemailer
    1. From the directory of the repository the user can execute the following commands:
        * '''node liri.js concert-this <artist>''' 
