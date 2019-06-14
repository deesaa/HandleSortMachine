const { BrowserWindow } = require('electron').remote;
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');
const fs = require('fs');

var folders;
loadSavedState();
let clearHistoryBtn = document.getElementById("clear-history");
let saveHistoryBtn = document.getElementById("save-history");

ipcRenderer.on('pressedkey', () => {
    console.log(322);
})

ipcRenderer.on('close', () => {
    saveHistoy();
})

saveHistoryBtn.addEventListener('click', () => {
    saveHistoy();
})

function loadSavedState() {
    var t = fs.readFileSync(__dirname + "/appSavedState.json");
    var savedState = JSON.parse(t);
    folders = savedState.sortToFolders.folders;

    var li = document.getElementById('sort-window-map').getElementsByTagName('ul')[0];
    for (var i = 1; i <= savedState.sortToFolders.count; i++) {
        var key = folders[i - 1].key;
        var path = folders[i - 1].path;
        var newLiItem = document.createElement("li");
        newLiItem.innerText = "Press " + key + ": move to folder " + path;
        li.appendChild(newLiItem);
    }

    var history = savedState.history;
    history.forEach((item, index) => {
        var fileName = item.fileName;
        var origin = item.origin;
        var destination = item.destination;
        var liItem = document.createElement('li');
        liItem.innerHTML = `<span class="file-name">${fileName}</span> moved from <span class="origin">${origin}</span> to <span class="destination">${destination}</span>`;

        addToHistoryList(liItem);
    })
}

function saveHistoy() {
    var t = fs.readFileSync(__dirname + "/appSavedState.json");
    var savedState = JSON.parse(t);

    var newHistory = [];
    var lis = document.getElementById('history-list').getElementsByTagName('li');

    for (var i = 0; i < lis.length; i++) {
        var t = {
            fileName: lis[i].getElementsByClassName("file-name")[0].innerHTML,
            origin: lis[i].getElementsByClassName("origin")[0].innerHTML,
            destination: lis[i].getElementsByClassName("destination")[0].innerHTML
        }
        newHistory.unshift(t);
    }

    savedState.history = newHistory;

    console.log(savedState);

    fs.writeFileSync(__dirname + "/appSavedState.json", JSON.stringify(savedState));
}

function addToHistoryList(item) {
    var historyList = document.getElementById('history-list');
    if (historyList.firstChild) {
        historyList.insertBefore(item, historyList.firstChild)
    } else {
        historyList.appendChild(item);
    }
}