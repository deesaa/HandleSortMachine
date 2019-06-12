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

    var i1 = document.createElement("input");
    i1.type = "text";
    i1.name = "sort-to-folder-" + folderIndex;
    i1.id = "sort-to-folder-" + folderIndex;
    i1.value = "new";
    var i4 = document.createElement("input");
    i4.type = "button";
    i4.value = "Delete";
    var i2 = document.createElement("input");
    i2.type = "button";
    i2.value = "Choose Folder";
    var i3 = document.createElement("input");
    i3.type = "text";
    i3.name = "key-" + folderIndex;
    i3.id = "key-" + folderIndex;
    i3.value = "new";

    var div = document.createElement("div");
    div.className = "folder-line";
    div.appendChild(i1);
    div.appendChild(i4);
    div.appendChild(i2);
    div.appendChild(i3);

    var li = document.createElement("li");
    li.appendChild(div);
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