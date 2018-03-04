//request npm package
require("dotenv").config();

const key = require("./keys.js");
var twitter = require("twitter");
var request = require("request");
var spotify = require('node-spotify-api');
var fs = require("fs");

//setup new prototypes 
var client = new twitter(key.twitter);
var spotify = new spotify(key.spotify);

//blank variable for command
var command = process.argv[2];
var lookup = process.argv[3];

//take in a list of commands
function intiate(command, lookup) {
    switch (command) {
        case "my-tweets":
            tweet();
            break;

        case "spotify-this-song":
            if (lookup === null || lookup === undefined) {
                lookup = "The sign";
                spotifyStuff(lookup);
            }
            else {
                spotifyStuff(lookup);
            };
            break;
        case "movie-this":
            if (lookup === null || lookup === undefined) {
                lookup = "Mr. Nobody";
                movieStuff(lookup);
            }
            else {
                movieStuff(lookup);
            };
            break;

        case "do-what-it-says":
            lotto();
            break;

        default:
            var error = "no argument input";
            problem(error);
    }
};

function tweet() {
    var params = { screen_name: 'TheRickBlake' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) throw error;
        for (i = 0; i < 20; i++) {
            var space = '\n------------ Tweet-' + (i + 1) + '----------------\n';
            var curTweet = tweets[i];
            var tResults = '@' + curTweet.user.screen_name + ": " +
                curTweet.text + "\n" +
                curTweet.created_at + "\n";
            var total = space + tResults;
            console.log(total);
            fs.appendFile("log.txt", total, function (err) {
                if (err) {
                    problem(err)
                };
            });

        };
    });
};

function spotifyStuff(lookup) {
    spotify.search({ type: 'track', query: lookup, limit: 5 }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        };
        var song = data.tracks.items;
        for (i = 0; i < song.length; i++) {
            var artistsArray = [];
            var space = '\n------------' + parseInt(i + 1) + '-----------\n';
            for (a = 0; a < song[i].artists.length; a++) {
                var artist = song[i].artists;
                artistsArray.push(("Artists " + parseInt(a + 1) + " Name: " + artist[a].name));
                // console.log("Artists " + parseInt(a + 1) + " Name: " + artist[a].name);
            };
            var songData = (
                "\n" + space +
                artistsArray.join("\n") +
                "\nSong Name: " + song[i].name +
                "\nShortcut: " + song[i].href +
                "\nAlbum Name: " + song[i].album.name
            )
            console.log(songData);
            fs.appendFile("log.txt", songData, function (err) {
                if (err) {
                    problem(err)
                };
            });
        };
    });
};

function movieStuff(lookup) {
    request("http://www.omdbapi.com/?t=" + lookup + "&y+=&plot=short&apikey=trilogy", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            var space = '\n------------ Movie-----------------\n';
            for (i in JSON.parse(body).Ratings) {
                if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                    var rtnTom = JSON.parse(body).Ratings[i].Value;
                };
            };
            var output = (
                "Movie Title: " + JSON.parse(body).Title
                + "\nMovie Year: " + JSON.parse(body).Year
                + "\nIMBD Movie Rating: " + JSON.parse(body).imdbRating
                + "\nRotten Tomatoes Rating: " + rtnTom
                + "\nCountry where it was made: " + JSON.parse(body).Country
                + "\nLanguage: " + JSON.parse(body).Language
                + "\nPlot: " + JSON.parse(body).Plot
                + "\nActors: " + JSON.parse(body).Actors
            );
            var total = space + output;
            console.log(total);
            fs.appendFile("log.txt", total, function (err) {
                if (err) {
                    problem(err)
                };
            });
        } else {
            console.log("there was an error")
        };
    });
};

function lotto() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            problem(err)
        }
        else {
            console.log(data);
            var dataArr = data.split(",");
            console.log(dataArr);
            intiate(dataArr[0], dataArr[1])
        }
    });
};

function problem(err) {
    console.log("error: " + err);
};

//intialize liri
intiate(command, lookup);