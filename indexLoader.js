
const fs = require('fs');

loadSavedState();




function loadSavedState() {
    var t = fs.readFileSync(__dirname + "/appSavedState.json");
    var savedState = JSON.parse(t);

    document.getElementById("folder-to-sort").value = savedState.folderToSort;

    var list = document.getElementById("sort-to-folder").getElementsByTagName('ul')[0];

    var count = savedState.sortToFolders.count;
    for (var i = 1; i <= count; i++) {
        var folderLine = createFolderLineElement(i, savedState);
        list.appendChild(folderLine);
    }
}

function createFolderLineElement(number, savedState) {
    var i1 = document.createElement("input");
    i1.type = "text";
    i1.name = "sort-to-folder-" + number;
    i1.id = "sort-to-folder-" + number;
    i1.value = savedState.sortToFolders.folders[number - 1].path;
    var i2 = document.createElement("input");
    i2.type = "button";
    i2.value = "Choose Folder";
    var i3 = document.createElement("input");
    i3.type = "text";
    i3.name = "key-" + number;
    i3.id = "key-" + number;
    i3.value = savedState.sortToFolders.folders[number - 1].key;

    var div = document.createElement("div");
    div.className = "folder-line";
    div.appendChild(i1);
    div.appendChild(i2);
    div.appendChild(i3);

    var li = document.createElement("li");
    li.appendChild(div);

    return li;
}