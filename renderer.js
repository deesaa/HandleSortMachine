// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { BrowserWindow } = require('electron').remote;
const { dialog } = require('electron').remote;

const chooseFTS = document.getElementById('choose-folder-to-sort');

chooseFTS.addEventListener('click', (e) => {
    let folderPath = dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (folderPath !== undefined) {
        document.getElementById('folder-to-sort').value = folderPath;
    } else {
        console.log('Denied');
    }
});