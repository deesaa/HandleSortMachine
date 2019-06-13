
const fs = require('fs');
const ec = require("./elementCreator.js");

loadSavedState();

function loadSavedState() {
    var t = fs.readFileSync(__dirname + "/appSavedState.json");
    var savedState = JSON.parse(t);

    document.getElementById("folder-to-sort").value = savedState.folderToSort;

    var list = document.getElementById("sort-to-folder").getElementsByTagName('ul')[0];

    var count = savedState.sortToFolders.count;
    for (var index = 1; index <= count; index++) {

        var path = savedState.sortToFolders.folders[index - 1].path;
        var key = savedState.sortToFolders.folders[index - 1].key;

        var folderLine = ec.createFolderLineListElement(index, path, key);
        list.appendChild(folderLine);
    }
}
