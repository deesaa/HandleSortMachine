// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
let aboutWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Handle Sort Machine",
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('close', () => {
    mainWindow.webContents.send('app-closing');
  })

  mainWindow.on('closed', function () {
    mainWindow = null;
    app.quit();
  });

  buildMenu();
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

function buildMenu() {

  var keysList = JSON.parse(fs.readFileSync(path.join(__dirname, "sortKeysList.json")));

  keysList.forEach((key) => {
    mainMenuTemplate[1].submenu.push({
      label: '',
      accelerator: key.sortKey,
      click() {
        mainWindow.webContents.send('pressedkey', { key: key.sortKey });
      }
    })
  })
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: '',
    submenu: [
      {
        label: '',
        accelerator: "Enter",
        click() {
          mainWindow.webContents.send('pressed:enter');
        }
      },
      {
        label: '',
        accelerator: "Escape",
        click() {
          mainWindow.webContents.send('pressed:esc');
        }
      }
    ]
  },
  {
    label: "About",
    click() {
      if (!aboutWindow) {
        aboutWindow = new BrowserWindow({
          width: 300,
          height: 300,
          title: "About",
          autoHideMenuBar: true,
        });

        aboutWindow.on('closed', () => { aboutWindow = null });

        aboutWindow.loadFile('about.html');

      }
    }
  }
];

// if (process.env.NODE_ENV !== 'prod') {
//   mainMenuTemplate.push({
//     label: 'Developer Tools',
//     submenu: [
//       {
//         label: 'Toggle Devtools',
//         click(item, focusedWindow) {
//           focusedWindow.toggleDevTools();
//         },
//       },
//       {
//         label: 'Restart',
//         click(item, focusedWindow) {
//           focusedWindow.reload();
//         }
//       }
//     ]
//   });
// }

