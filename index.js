const { downloadPokemonPicture } = require("./downloader.js")

//-- it will return a Promise
//-- .then("returned name")
downloadPokemonPicture().then(savedFileOutput => {
    console.log("new image is saved to: " + savedFileOutput);
}).catch(error => {
    console.log(error);
})

//-- Asyncronous way
async function exampleDownload(){
    let savedFileOutput = await downloadPokemonPicture();
    console.log("new image is saved to: " + savedFileOutput);
}

exampleDownload();