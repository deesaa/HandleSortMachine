const { BrowserWindow } = require('electron').remote;
const { dialog } = require('electron').remote;
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

var folders = [];
var sortingFolder;
var targetFiles;
var currentImage = null;
const imageFilesEx = [".jpg", ".png", ".gif", ".jpeg", ".jpg_large"];
const videoFilesEx = [".webm", ".mp4"];
loadSavedState();
loadTargetFiles();
loadNextFile();

let clearHistoryBtn = document.getElementById("clear-history");
let saveHistoryBtn = document.getElementById("save-history");
let cancelMoveBtn = document.getElementById("cancel-move");
let hideHistoryButton = document.getElementById('hide-history');

saveHistoryBtn.addEventListener('click', () => {
    saveHistoy();
})

window.addEventListener('beforeunload', () => {
    saveHistoy();
})

clearHistoryBtn.addEventListener('click', () => {
    clearHistory();
})

cancelMoveBtn.addEventListener('click', () => {
    cancelLastMove();
})

hideHistoryButton.addEventListener('click', () => {
    hideHistory();
})

ipcRenderer.on('pressedkey', (e, arg) => {
    //Нажатиями перемещаем файлы в нужные папки
    if (currentImage) {
        var key = arg.key;
        var destinationPath;
        //Ищем нужный путь по ключу
        var folder = folders.find((folder, index) => {
            return folder.key === key;
        });

        if (folder) {
            destinationPath = folder.path;
        } else {
            console.log("Папка не найдена");
        }

        if (destinationPath && currentImage && targetFiles[0]) {
            //Перемещаем текущую картинку в папку по найденному пути
            fs.renameSync(currentImage, path.join(destinationPath, targetFiles[0]));

            //Запись в историю 
            var fileName = targetFiles[0];
            var origin = sortingFolder;
            var destination = destinationPath;
            var liItem = document.createElement('li');
            liItem.innerHTML = `<span class="file-name">${fileName}</span> moved from <span class="origin">${origin}</span> to <span class="destination">${destination}</span>`;
            addToHistoryList(liItem);

            //Убираем перемещенный файл из текущих
            targetFiles.shift();
            //Загружаем следующий файл
            loadNextFile();
        } else {
            console.log("Путь не найден");
        }
    }
})

function loadTargetFiles() {

    //TODO: Добавить все остальные расширения (.webm)
    var extensions = imageFilesEx.concat(videoFilesEx);
    var files = fs.readdirSync(sortingFolder);
    targetFiles = files.filter((file) => {
        return extensions.some((i) => {
            return i === path.extname(file).toLowerCase();
        })
    });
}

function loadNextFile() {
    if (targetFiles.length != 0) {
        currentImage = sortingFolder + "/" + targetFiles[0];

        //Картинка или видео
        if (imageFilesEx.some((item) => {
            return item === path.extname(targetFiles[0]).toLowerCase();
        })) {
            //Картинка
            document.getElementById("image-for-sort").setAttribute("src", currentImage);
            document.getElementById("image-for-sort").style = "display: block";
            document.getElementById("video-for-sort").setAttribute("src", " ");
            document.getElementById("video-for-sort").hidden = true;
            document.getElementById("no-files").style = "display: none";
        } else {
            //Видео
            document.getElementById("video-for-sort").setAttribute("src", currentImage);
            document.getElementById("video-for-sort").hidden = false;
            document.getElementById("image-for-sort").setAttribute("src", " ");
            document.getElementById("image-for-sort").style = "display: none";
            document.getElementById("no-files").style = "display: none";
        }
    } else {
        console.log("Нет подходящих файлов в папке");
        document.getElementById("image-for-sort").setAttribute("src", " ");
        document.getElementById("video-for-sort").setAttribute("src", " ");
        document.getElementById("image-for-sort").style = "display: none";
        document.getElementById("video-for-sort").hidden = true;
        document.getElementById("no-files").style = "display: block";
    }
}

function loadSavedState() {
    var t = fs.readFileSync(path.join(__dirname, "appSavedState.json"));
    var savedState = JSON.parse(t);
    folders = savedState.sortToFolders.folders;
    sortingFolder = savedState.folderToSort;

    var li = document.getElementById('sort-window-map').getElementsByTagName('ul')[0];
    for (var i = 1; i <= savedState.sortToFolders.count; i++) {
        var key = folders[i - 1].key;
        var destinationPath = folders[i - 1].path;
        var newLiItem = document.createElement("li");
        newLiItem.innerHTML = `Press <span class="key">${key}</span>: move to folder <span class="destination">${destinationPath}</span>`
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

    //Если установлен флаг на очистку истории, очищаем и убираем флаг
    if (savedState.clearHistoryOnLoad) {
        clearHistory();
        savedState.clearHistoryOnLoad = false;
    }

    fs.writeFileSync(path.join(__dirname, "appSavedState.json"), JSON.stringify(savedState));
}

function saveHistoy() {
    var pathToSavedState = path.join(__dirname, "appSavedState.json");
    var t = fs.readFileSync(pathToSavedState);
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

    fs.writeFileSync(pathToSavedState, JSON.stringify(savedState));
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
    while (historyList.lastChild) {
        historyList.removeChild(historyList.lastChild);
    }
}

function hideHistory() {
    var hide = hideHistoryButton.checked;

    if (hide) {
        document.getElementById('history-list-block').style.display = "none";
    } else {
        document.getElementById('history-list-block').style.display = "block";
    }
}

function cancelLastMove() {
    var historyList = document.getElementById('history-list');
    if (historyList.getElementsByTagName('li')[0]) {

        //Перемещаем файл обратно
        var fileName = historyList.getElementsByTagName('li')[0].getElementsByClassName('file-name')[0].innerHTML;
        var origin = historyList.getElementsByTagName('li')[0].getElementsByClassName('origin')[0].innerHTML;
        var destination = historyList.getElementsByTagName('li')[0].getElementsByClassName('destination')[0].innerHTML;
        fs.renameSync(path.join(destination, fileName), path.join(origin, fileName));

        //Удаляем из истории
        historyList.firstChild.remove();

        //Добавляем в текущие файлы 
        targetFiles.unshift(fileName);

        //Загружаем картинку
        loadNextFile();

        //TODO: Если сменилась папка сортировки, то очищаем историю при загрузке
    }
}