// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { BrowserWindow } = require('electron').remote;
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');

const chooseFTS = document.getElementById('choose-folder-to-sort');
var chooseKey = document.getElementById('key-1');

chooseKey.addEventListener('click', (e) => {
    if (keyWin === null) {
        createKeyWindow();
        chooseKey.disabled = true;
    }
})

let keyWin = null;


function createKeyWindow() {
    keyWin = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        parent: BrowserWindow,
        width: 150,
        height: 150
    });

    keyWin.loadFile('listenKey.html');

    keyWin.on('close', () => {
        chooseKey.disabled = false;
        keyWin = null;
    })
}

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

ipcRenderer.on("app-closing", () => {
    saveAppState();
})

ipcRenderer.on("show", () => {

})


function saveAppState() {
    var t = fs.readFileSync(__dirname + "/appSavedState.json");
    var savedState = JSON.parse(t);

    savedState.folderToSort = document.getElementById('folder-to-sort').value;



    fs.writeFileSync(__dirname + "/appSavedState.json", JSON.stringify(savedState));
}