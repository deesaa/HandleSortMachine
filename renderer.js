// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { BrowserWindow } = require('electron').remote;
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');

const chooseFTS = document.getElementById('choose-folder-to-sort');
var chooseKey = document.getElementById('key-1');

let keyWin = null;

let saveButton = document.getElementById('save-button');
let addFolderButton = document.getElementById('add-sort-to-folder');

setEventListners();


chooseKey.addEventListener('click', (e) => {
    if (keyWin === null) {
        createKeyWindow();
        chooseKey.disabled = true;
    }
});

saveButton.addEventListener('click', (e) => {
    saveAppState();
});

addFolderButton.addEventListener('click', () => {
    addSortFolder();
});

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

function addSortFolder() {
    var list = document.getElementById("sort-to-folder").getElementsByTagName('ul')[0].getElementsByTagName('li');
    var folderIndex = list.length + 1;
    var path = "new";
    var key = "new";

    var li = ec.createFolderLineListElement(folderIndex, path, key);

    document.getElementById("sort-to-folder").getElementsByTagName('ul')[0].appendChild(li);
}

function saveAppState() {
    var t = fs.readFileSync(__dirname + "/appSavedState.json");
    var savedState = JSON.parse(t);

    savedState.folderToSort = document.getElementById('folder-to-sort').value;

    var sortToFolder = document.getElementById("sort-to-folder");
    var ul = sortToFolder.getElementsByTagName("ul")[0];
    var lis = ul.getElementsByTagName("li");
    savedState.sortToFolders.count = lis.length;

    for (i = 0; i < lis.length; i++) {
        var folder = {};
        folder.path = document.getElementById("sort-to-folder-" + (i + 1)).value;
        folder.key = document.getElementById("key-" + (i + 1)).value;
        savedState.sortToFolders.folders[i] = folder;
    }

    fs.writeFileSync(__dirname + "/appSavedState.json", JSON.stringify(savedState));
}


function setEventListners() {
    var lis = document.getElementsByTagName("li");
    var count = lis.length;

    for (var index = 1; index <= count; index++) {
        var stf = document.getElementById("choose-folder-" + index);
        function chooseFolder() {
            var elIndex = index;
            return function () {
                let folderPath = dialog.showOpenDialog({
                    properties: ['openDirectory']
                });

                if (folderPath !== undefined) {
                    document.getElementById("sort-to-folder-" + elIndex).value = folderPath;
                } else {
                    console.log('Denied');
                }
            }
        }
        stf.addEventListener('click', chooseFolder());


        var df = document.getElementById("delete-" + index);
        function deleteFolder() {
            var elIndex = index;
            return function () {
                console.log("deleting folder " + elIndex);
            }
        }
        df.addEventListener('click', deleteFolder());

    }
}