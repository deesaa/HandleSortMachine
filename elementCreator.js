

function createFolderLineListElement(index, path, key) {
    var i1 = document.createElement("input");
    i1.type = "text";
    i1.id = "sort-to-folder-" + index;
    i1.value = path;
    var i4 = document.createElement("input");
    i4.type = "button";
    i4.id = "delete-" + index;
    i4.value = "Delete";
    var i2 = document.createElement("input");
    i2.type = "button";
    i2.id = "choose-folder-" + index;
    i2.value = "Choose Folder";
    var i3 = document.createElement("input");
    i3.type = "text";
    i3.id = "key-" + index;
    i3.value = key;

    var div = document.createElement("div");
    div.className = "folder-line";
    div.appendChild(i1);
    div.appendChild(i4);
    div.appendChild(i2);
    div.appendChild(i3);

    var li = document.createElement("li");
    li.appendChild(div);

    return li;
}

module.exports.createFolderLineListElement = createFolderLineListElement;