
//-- Synchronous library for doing file IO
const fs = require("node:fs");

//-- Asynchronous function, making a direction can take time
const{ mkdir } = require("node:fs/promises");

//-- Streaming data, safer than traditional saving/downloading etc
//-- Synchronous, so we wait and it is blocking
const { Readable } = require("node:stream");

//-- Wait for streaming to finish, it can take time, so it should be a promise
//-- It should be blocking, let's handle this with a promise instead of async/await
const { finished } = require("node:stream/promises");

//-- Node file & directory path helper system
//-- /folder/subfolder/filename.png
const path = require("node:path");

const API_URL_BASE = "https://pokeapi.co/api/v2/pokemon/";


function downloadPokemonPicture (targetId = getRandomPokemonId()){

};

//-- Generate a random number between 1 and 1017 (number of pokemons 1292)
function downloadPokemonId(){
    return math.floor(math.random() * 1017) +1;
};

//-- Retrieve Pokemon data for that number
//-- Retrieve the image url frmo that Pokemon data
//-- async because we need access to the image
async function getPokemonPictureUrl(targetId = getRandomPokemonId()){
    
    //-- Retreieve the API data
    let response = await fetch(API_URL_BASE + targetId).catch(error => {
        //-- No response from API
        throw new Error("API faliure");
    });

    //-- If response but data not found
    if (response.status == "404") {
        throw new Error("API did not have data for the requested ID")
    };

    //-- Convert the response into usable JSON
    let data = await response.json().catch(error => {
        //-- response, with data, but not in JSON format
        throw new Error ("API did not return valid JSON");
    });

    //-- The below code contains unecessary variables
    // let imageURL = data.sprites.other["official-artwork"].front_default;
    // return imageURL;

    //-- This is the optimised return for the above code
    return data.sprites.other["official-artwork"].front_default;
};


//-- Download that image and save it to the computer
//-- Return the downloader image's file path
//-- async because we need access to the api and we will be working with files
async function savePokemonPictureToDisk(targetUrl, targetDownloadFilename, targetDownloadDirectory = "."){
    //-- fetch request to the imageURL
    let imageData = await fetch(targetUrl).catch(error => {
        throw new Error("API faliure");
    })


    //-- Check if Target Directory exists

    //-- Stream the image from the fetch to the computer

    //-- Return the saved image loation

}

modules.export = {
    downloadPokemonPicture,
    downloadPokemonId,
    getPokemonPictureUrl,
    savePokemonPictureToDisk,

}

//-- async means it will wait for the api response