const { BrowserWindow } = require('electron').remote;
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

var folders = [];
var sortingFolder;
var targetFiles;
var currentImage = null;
loadSavedState();
loadTargetFiles();
loadNextImage();

let clearHistoryBtn = document.getElementById("clear-history");
let saveHistoryBtn = document.getElementById("save-history");
let cancelMoveBtn = document.getElementById("cancel-move");

saveHistoryBtn.addEventListener('click', () => {
    saveHistoy();
})

window.addEventListener('beforeunload', () => {
    saveHistoy();
})

clearHistoryBtn.addEventListener('click', () => {
    clearHistory();
})

ipcRenderer.on('pressedkey', (e, arg) => {
    //Нажатиями перемещаем файлы в нужные папки
    if (currentImage) {
        var key = arg.key;
        var path;
        //Ищем нужный путь по ключу
        var folder = folders.find((folder, index) => {
            return folder.key === key;
        });

        if (folder) {
            path = folder.path;
        } else {
            console.log("Папка не найдена");
        }

        if (path) {

            //Перемещаем текущую картинку в папку по найденному пути
            fs.renameSync(currentImage, path + "/" + targetFiles[0]);

            //TODO:Запись в историю 
            var fileName = targetFiles[0];
            var origin = sortingFolder;
            var destination = path;
            var liItem = document.createElement('li');
            liItem.innerHTML = `<span class="file-name">${fileName}</span> moved from <span class="origin">${origin}</span> to <span class="destination">${destination}</span>`;
            addToHistoryList(liItem);

            //Убираем перемещенный файл из текущих
            targetFiles.shift();
            //Загружаем следующий файл
            loadNextImage();
        } else {
            console.log("Путь не найден");
        }
    }
})

function loadTargetFiles() {

    //TODO: Добавить все остальные расширения
    var extension = '.jpg';
    var files = fs.readdirSync(sortingFolder);
    targetFiles = files.filter((file) => {
        return path.extname(file).toLowerCase() === extension;
    });
}

function loadNextImage() {
    if (targetFiles.length != 0) {
        currentImage = sortingFolder + "/" + targetFiles[0];
        document.getElementById("image-for-sort").setAttribute("src", currentImage);
    } else {
        console.log("Нет подходящих файлов в папке");

    }
}

function loadSavedState() {
    var t = fs.readFileSync(__dirname + "/appSavedState.json");
    var savedState = JSON.parse(t);
    folders = savedState.sortToFolders.folders;
    sortingFolder = savedState.folderToSort;

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

function clearHistory() {
    var historyList = document.getElementById('history-list');
    while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
    }
}