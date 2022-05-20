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
    const fs = require("fs");
    const { v4: uuidv4 } = require("uuid");

    if (port === port2) {
      console.log(
        `A porta: ${port} é igual a porta: ${port2} verifique a porta do servidor`
      );
    } else {
      let pathInputTmp = "./src/tmp/";

      fs.unlink(pathInputTmp, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Arquivos temporários foram deletados com sucesso!");
        }
      });

      let uuid = uuidv4();
      mainWindow.windowContent
        .executeJavascript(`setUUIDWindowApp(${uuid})`)
        .catch.catch((error) => {
          console.error("Tente novamente: ", error);
        });

      const ip = require("ip");
      let localIP = ip.address();

      const server = {
        ip: localIP,
        port: port2,
        running: true,
        windowKey: uuid,
      };

      fetch("https://zapdelivery.me/minhaconta/setserver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(server),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Sucesso:", data);
        })
        .catch((error) => {
          console.error("Error:", data);
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
    // 🚀 informar ao DOM a UUID da janela
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
