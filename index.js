const { app, BrowserWindow, Menu, screen } = require("electron");
const port = process.env.PORT || 3000;
const { server, setWindow } = require("./src/Controllers/Server")

function createWindow() {

  const {width, height} = screen.getPrimaryDisplay().workAreaSize

  loadWindow = new BrowserWindow({
    width: 250,
    height: 300,
    center: true,
    show: false,
    titleBarStyle: "hidden",
    roundedCorners: true,
    transparent: true,
    icon: "./src/assets/icon-256x256.png"
  })

  loadWindow.loadFile("./src/Viewers/Loader/index.html");

  loadWindow.once('ready-to-show', () => {
    loadWindow.show();
  })

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    center: true,
    maximizable: true,
    icon: "./src/assets/icon-256x256.png"
  })

  mainWindow.loadURL('http://localhost:5005/minhaconta')

  Menu.setApplicationMenu(null);
  
  setWindow.window = mainWindow;
  
  mainWindow.once('ready-to-show', () => {
    loadWindow.close();
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.focus();
  })

  server.listen(port, () => {
    console.log(`Process listen in http://localhost:${port}`);
  });
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
