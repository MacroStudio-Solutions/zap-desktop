import { app, BrowserWindow, Menu } from "electron";


  

function createWindow () {

    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      // icon: path.join(__dirname, 'icon.ico'),
    //   webPreferences: {
    //     preload: path.join(__dirname, 'preload.js')
    //   }
    })
  
    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000')
  
    // Open the DevTools.
    //mainWindow.webContents.openDevTools()
  
    server.setWindowRef(mainWindow);
  }
  
  app.whenReady().then(() => {
    createWindow()
  
    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  
  
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })
  