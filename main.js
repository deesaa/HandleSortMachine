// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
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
  }
];

if (process.env.NODE_ENV !== 'prod') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle Devtools',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        label: 'Restart',
        click(item, focusedWindow) {
          focusedWindow.reload();
        }
      }
    ]
  });
}

