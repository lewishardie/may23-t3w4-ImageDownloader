
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


function downloadPokemonPicture(targetId = getRandomPokemonId()){
    return new Promise (async(resolve, reject) => {
        try {

            //-- Step 1: get the image url
            // let newUrl = await getPokemonPictureUrl(targetId);
            //-- 
            let newPokemon = await getPokemonPictureUrlandName(targetId);
            
            //-- Step 2: do the download

            //-- Option 1: hardcoded filename to ExampleImage, ( not ideal )
            // let saveFileLocation = await savePokemonPictureToDisk(newUrl, "ExampleImage.png", "storage");
            
            //-- Option 2: Pokemon + id, not idetifiable, we want the name
            // let saveFileLocation = await savePokemonPictureToDisk(newUrl, `Pokemon${targetId}.png`, "storage");
            
            //-- Option 3: Pokemon name.png, Access the JSON to get the Pokemon name, a second fetch though, not efficient
            // let response = await fetch(API_URL_BASE + targetId)
            // let data = await response.json();

            // let saveFileLocation = await savePokemonPictureToDisk(newUrl, `${data.name}.png`, "storage");

            //-- Option 4: changed the firt fetch and returns an object with the name and image URL
            let saveFileLocation = await savePokemonPictureToDisk(newPokemon.imageUrl, `${newPokemon.name}.png`, "storage");

            resolve(saveFileLocation);
        } catch (error) {
            reject(error);
        }
    })
};

//-- Generate a random number between 1 and 1017 (number of pokemons 1292)
function getRandomPokemonId(){
    return Math.floor(Math.random() * 1017) +1;
};

//-- Retrieve Pokemon data for that number
//-- Retrieve the image url frmo that Pokemon data
//-- async because we need access to the image
async function getPokemonPictureUrlandName(targetId = getRandomPokemonId()){
    
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
    // return data.sprites.other["official-artwork"].front_default;

    //-- Optimised return to access for file name
    return {
        name: data.name,
        imageUrl: data.sprites.other["official-artwork"].front_default
    }
};


//-- Download that image and save it to the computer
//-- Return the downloader image's file path
//-- async because we need access to the api and we will be working with files
async function savePokemonPictureToDisk(targetUrl, targetDownloadFilename, targetDownloadDirectory = "."){
    
    //-- fetch request to the imageURL
    let imageData = await fetch(targetUrl).catch(error => {
        throw new Error("Invalid Image");
    });

    //-- Check if Target Directory exists
    if (!fs.existsSync(targetDownloadDirectory)){
        //-- Make a directory if we need to
        await mkdir(targetDownloadDirectory);
    }

    //-- Create a JS-friendly file path
    let fullFileDestination = path.join(targetDownloadDirectory, targetDownloadFilename);
    
    //-- Stream the image from the fetch to the computer
    let fileDownloadStream = fs.createWriteStream(fullFileDestination);

    //-- Get data as bytes from the web request, ----> pipe the bytes into the hard drive
    await finished(Readable.fromWeb(imageData.body).pipe(fileDownloadStream)).catch(error => {
        throw new Error("Failed to save content to disk");
    });
    
    //-- Return the saved image loation
    return fullFileDestination;

}

module.exports = {
    downloadPokemonPicture,
    getPokemonPictureUrlandName,
    savePokemonPictureToDisk,
    getRandomPokemonId
}

//-- async means it will wait for the api response