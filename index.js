const { app, BrowserWindow, Menu, screen } = require("electron");
const port = process.env.PORT || 3000;
const { server, setWindow } = require("./src/Controllers/Server")

function createWindow() {

  const { width, height } = screen.getPrimaryDisplay().workAreaSize

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


  // TODO:
  // gerar id da janela

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    center: true,
    maximizable: true,
    icon: "./src/assets/icon-256x256.png"
  })

  mainWindow.loadURL('https://zapdelivery.me/minhaconta')

  Menu.setApplicationMenu(null);

  setWindow.window = mainWindow;

  mainWindow.once('ready-to-show', () => {
    loadWindow.close();
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.focus();

    // TODO: 
    // startServer()
  })

  server.listen(port, () => {

    // TODO:
    //
    // 🚀 Apagar tmp dir
    // 🚀 Gerar id da janela
    // 🚀 Não pode ter dois servidores do Zap na mesma rede
    // 🚀 informar ao backend (via POST) qual a porta do servidor, uuid, status      
    //     ... somente se a janela principal estiver carregada

    // fetch/axios https://zapdelivery.me/minhaconta/setserver (Example endpoint)
    // Authentication: ???

    // POST DATA
    // server: {
    //   ip: localIP
    //   port: port,
    //   running: true
    //   windowKey: UUID // key da janela do server
    // }

    // Após janela carregada
    // 🚀 informar ao DOM a UUID da janela
    // Example:
    // mainWindow.windowContent.executeJavascript(`setUUIDWindowApp(${"D54G6ED54G6E54"})`).catch(e => { // tentar novamente })

    // 🚀 Buildar o APP (electron-builder)
    // 🚀 Validar boas práticas da build (ex: configs de icones e etc)
    // 🚀 Gerar instalador (MSI)

    console.log(`Process listen in http://localhost:${port}`);
  });
}

app.whenReady().then(() => {
  // clean tmp
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
