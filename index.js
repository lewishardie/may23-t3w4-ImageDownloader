const { downloadPokemonPicture } = require("./downloader.js");



//-- it will return a Promise
//-- .then("returned name")
//-- synch way
downloadPokemonPicture().then(saveFileOutput => {
    console.log("new image is saved to: " + saveFileOutput);
}).catch(error => {
    console.log(error);
})

//-- async way
async function exampleDownload(){
    let savedFileOutput = await downloadPokemonPicture();
    console.log("new image is saved to: " + saveFileOutput);
}

exampleDownload();