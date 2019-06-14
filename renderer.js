// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { BrowserWindow } = require('electron').remote;
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');

const chooseFTS = document.getElementById('choose-folder-to-sort');

let editingKeyWin = null;
let editingKey = null;

let sortingWindow = null;

let saveButton = document.getElementById('save-button');
let addFolderButton = document.getElementById('add-sort-to-folder');
let startSortButton = document.getElementById('start-sort-button');

setAllEventListners();

saveButton.addEventListener('click', (e) => {
    saveAppState();
});

addFolderButton.addEventListener('click', () => {
    addSortFolder();
});

startSortButton.addEventListener('click', () => {
    if (sortingWindow === null) {
        saveAppState();

        sortingWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            }
        })
        sortingWindow.loadFile('sortingWindow.html');
        sortingWindow.maximize();

        sortingWindow.on('close', () => {
            sortingWindow = null;
        })
    } else {
        sortingWindow.focus();
    }
})

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

    addEventListenersTo(folderIndex);
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


function setAllEventListners() {
    var lis = document.getElementsByTagName("li");
    var count = lis.length;

    for (var index = 1; index <= count; index++) {
        addEventListenersTo(index);
    }
}

function addEventListenersTo(index) {
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
            var listItem = document.getElementById("list-item-" + elIndex);
            listItem.remove();
        }
    }
    df.addEventListener('click', deleteFolder());

    var key = document.getElementById("key-" + index);
    function selectKey() {
        var elIndex = index;
        return function () {
            console.log('selectin key for ' + elIndex);

            if (editingKeyWin === null) {
                createKeyWindow(key);
                editingKey = document.getElementById("key-" + elIndex);
                key.disabled = true;
            } else {
                editingKeyWin.focus();
            }
        }
    }
    key.addEventListener('click', selectKey());
}

function createKeyWindow(keyElement) {
    editingKeyWin = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        alwaysOnTop: true,
        parent: BrowserWindow,
        width: 250,
        height: 250,
        autoHideMenuBar: true
    });

    editingKeyWin.loadFile('listenKey.html');

    editingKeyWin.on('close', () => {
        keyElement.disabled = false;
        editingKeyWin = null;
        editingKey = null;
    })
}

ipcRenderer.on('pressedkey', (e, arg) => {
    //Если открыто окно сортировки, перебрасываем нажатые кнопки в него
    if (sortingWindow !== null) {
        sortingWindow.webContents.send('pressedkey', arg);
        return;
    }

    if (editingKey !== null && arg.key != null)
        editingKey.value = arg.key;
})


ipcRenderer.on('pressed:enter', () => {
    if (editingKeyWin !== null) {
        editingKeyWin.close();
    }
})