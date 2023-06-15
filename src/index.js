// This file is the entry point for the Electron application.

const { app, BrowserWindow, ipcMain, dialog, Notification, Tray, Menu } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  ipcMain.handle('SHOW_DIALOG', (event, args) => {
    dialog.showMessageBox(win, args)
  });

  ipcMain.handle('SHOW_NOTIFICATION', (event, args) => {
    new Notification(args).show();
  });

  win.on('close', (event) => {
    if (!app.isExitForced) {
      event.preventDefault();
      win.hide();
    }

    return false;
  })

  const appTray = new Tray(path.join(__dirname, 'tray-icon.jpg'))
  const trayCtxMenu = new Menu.buildFromTemplate([
    { label: 'Open', click: () => win.show() },
    { label: 'Exit', click: () => {
      app.isExitForced = true;
      app.quit();
    }}
  ])
  appTray.setContextMenu(trayCtxMenu);

  if (process.env.NODE_ENV !== 'development') {
    // Load production build
    win.loadFile(`${__dirname}/renderer/dist/index.html`)
  } else {
    // Load vite dev server page 
    console.log('Development mode')
    win.loadURL('http://localhost:3000/')
  }
}

app.whenReady()
  .then(() => {
    createWindow()

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})