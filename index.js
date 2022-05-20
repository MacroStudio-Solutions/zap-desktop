const { app, BrowserWindow, Menu, screen } = require("electron");
const port = process.env.PORT || 3000;
const { server, setWindow } = require("./src/Controllers/Server");
const { v4: uuidv4 } = require("uuid");
const ip = require("ip");
const axios = require("axios").default;
const del = require("node-delete");

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
    icon: "./src/assets/icon-256x256.png",
  });

  loadWindow.loadFile("./src/Viewers/Loader/index.html");

  loadWindow.once("ready-to-show", () => {
    loadWindow.show();
  });

  // TODO:
  // gerar id da janela

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    center: true,
    maximizable: true,
    icon: "./src/assets/icon-256x256.png",
  });

  mainWindow.loadURL("https://zapdelivery.me/minhaconta");

  Menu.setApplicationMenu(null);

  setWindow.window = mainWindow;

  mainWindow.once("ready-to-show", () => {
    loadWindow.close();
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.focus();

    axios
      .get("http://localhost:3000/app-zap-running")
      .then(function (data) {
        if (data == true) {
          console.log(`Servidor já foi iniciado na porta: ${port}`);
        } else {
          server.listen(port, () => {
            //imports para os pacotes

            // variável contendo o id da requisição
            let uuid = uuidv4();

            //função para deletar os arquivos na pasta ''tmp''
            del(["./src/tmp/*"], function (err, paths) {});

            // variável contendo o localIP do computador que fez a requisição
            let localIP = ip.address();
            //requisição do tipo Post com Axios para passar os parametros para a API
            axios
              .post("https://zapdelivery.me/minhaconta/setserver", {
                ip: localIP,
                port: port,
                running: true,
                windowKey: uuid,
              })
              .then(function (response) {
                console.log(response);
              })
              .catch(function (error) {
                console.log(error);
              });
            //informar o DOM o ID da janela
            mainWindow.webContents
              .executeJavaScript(`setUUIDWindowApp(${uuid})`)
              .catch((e) => {
                console.log("tente novamente");
              });
          });
          console.log(`Process listen in http://localhost:${port}`);
        }
      })
      .catch(function (error) {
        console.log(error);
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

    // Após janela carregadaX
    // 🚀 informar ao DOM a UUID da janela
    // Example:
    //

    // 🚀 Buildar o APP (electron-builder)
    // 🚀 Validar boas práticas da build (ex: configs de icones e etc)
    // 🚀 Gerar instalador (MSI)
  });
}

app.whenReady().then(() => {
  // clean tmp
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
