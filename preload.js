// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const fs = require('fs');

window.addEventListener('DOMContentLoaded', () => {
    loadSavedState();
})

function loadSavedState() {
    var t = fs.readFileSync(__dirname + "/appSavedState.json");
    var savedState = JSON.parse(t);

    document.getElementById("folder-to-sort").value = savedState.folderToSort;
}