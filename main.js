// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu, dialog, nativeImage } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 300,
    height: 600,
    resizable: false,
    maximizable: false,
    icon: path.join(__dirname, 'icon.ico'),
    transparent: true,
    webPreferences: {
      //preload: path.join(__dirname, 'src/gui/index.js'),
      nodeIntegration: true, 
      contextIsolation: false
    }
  })

  win.loadURL(url.format ({
    pathname: path.join(__dirname, 'src/gui/index.html'),
    protocol: 'file',
    slashes: true
  }))

  //set menu
  win.setMenu(null);

  // Open the DevTools.
  //win.webContents.openDevTools()

  let tray = null;
  win.on('minimize', function(event) {
    event.preventDefault();
    win.setSkipTaskbar(true);
    tray = createTray();
  })

  win.on('restore', function(event) {
    win.show();
    win.setSkipTaskbar(false);
    tray.destroy()
  })

  return win;
}

function createTray() {
    let appIcon = new Tray(nativeImage.createFromPath(path.join(__dirname, "icon.ico")));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show', click: function () {
                mainWindow.show();
            }
        },
        {
            label: 'Exit', click: function () {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);

    appIcon.on('double-click', function (event) {
        mainWindow.show();
    });
    appIcon.setToolTip('Printer Server Adapter');
    appIcon.setContextMenu(contextMenu);
    return appIcon;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  mainWindow = createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
app.allowRendererProcessReuse = false