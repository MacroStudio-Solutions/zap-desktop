const { app, BrowserWindow, Menu, screen } = require("electron");
const { setWindow } = require("./src/server");

const useCleanCache = require("./src/hooks/useCleanCache");
const getServerConfig = require("./src/utils/getServerConfig")

function createWindow() {

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  loadWindow = new BrowserWindow({
    width: 250,
    height: 300,
    center: true,
    show: false,
    titleBarStyle: "hidden",
    roundedCorners: true,
    transparent: true,
    icon: "./src/assets/images/icon-256x256.png",
    webPreferences: {
      devTools: false
    }
  });

  loadWindow.loadFile("./src/view/loader/index.html");

  loadWindow.once("ready-to-show", () => {
    loadWindow.show();
  });

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    center: true,
    maximizable: true,
    icon: "./src/assets/images/icon-256x256.png",
    webPreferences: {
      devTools: false
    }
  });

  mainWindow.loadURL("https://zapdelivery.me/minhaconta");
  
  Menu.setApplicationMenu(null);

  setWindow.window = mainWindow;

  mainWindow.once("ready-to-show", () => {
    loadWindow.close();
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.focus();
    getServerConfig(mainWindow);
  });
}

app.whenReady().then(() => {
  useCleanCache();
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
