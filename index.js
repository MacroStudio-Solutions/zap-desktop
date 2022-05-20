const { app, BrowserWindow, Menu, screen } = require("electron");
const port = process.env.PORT || 3000;
const port2 = process.env.PORT || 9000;
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

  server.listen(port2, () => {
    
    const { v4: uuidv4 } = require("uuid");
    const ip = require("ip");
    const axios = require('axios').default;
    const del = require('node-delete');

    if (port === port2) {
      console.log(
        `A porta: ${port} é igual a porta: ${port2} verifique a porta do servidor`
      );
    } else {

   
    let pathInputTmp = "./src/tmp/";
     del(['./src/tmp/*'], function (err, paths) {});
      
      let uuid = uuidv4();
      let localIP = ip.address();
        axios.post("https://zapdelivery.me/minhaconta/setserver", {
          ip: localIP,
          port: port2,
          running: true,
          windowKey: uuid,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });
    // TODO:
    //
    // 🚀 Apagar tmp dir X
    // 🚀 Gerar id da janela X
    // 🚀 Não pode ter dois servidores do Zap na mesma rede X
    // 🚀 informar ao backend (via POST) qual a porta do servidor, uuid, status      
    //     ... somente se a janela principal estiver carregada X

    // fetch/axios https://zapdelivery.me/minhaconta/setserver (Example endpoint)X
    // Authentication: ???

    // POST DATA X
    // server: {
    //   ip: localIP
    //   port: port,
    //   running: true
    //   windowKey: UUID // key da janela do server
    // }

    // Após janela carregada
    // 🚀 informar ao DOM a UUID da janelax
    // Example:
    // mainWindow.windowContent.executeJavascript(`setUUIDWindowApp(${"D54G6ED54G6E54"})`).catch(e => { // tentar novamente })

    // 🚀 Buildar o APP (electron-builder)
    // 🚀 Validar boas práticas da build (ex: configs de icones e etc)
    // 🚀 Gerar instalador (MSI)

    console.log(`Process listen in http://localhost:${port2}`);
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
