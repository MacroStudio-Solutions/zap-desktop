const { app, BrowserWindow, Menu, screen } = require("electron");

const { server, setWindow } = require("./src/Controllers/Server");
const { v4: uuidv4 } = require("uuid");
const ip = require("ip");

const { useCheckServer } = require("./src/hooks/useCheckServer");
const { useCleanCache } = require("./src/hooks/useCleanCache");

const { useFreePort } = require("./src/hooks/useFreePort");

// TODO:
// somente gerar porta livre
// problema 

// useFreePort().then(res => {
//   console.log("New port >", res)
// });


const port = 3000;

function createWindow() {

  //const port = await useFreePort();

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const uuid = uuidv4();
  const localIP = ip.address();

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
  setWindow.window = uuid;

  mainWindow.once("ready-to-show", () => {
    loadWindow.close();
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.focus();

    if (!useCheckServer(port)) {

      // Retorna true se não houver outra instância do server no localhost
      // porém, o app não sabe qual a porta foi utilizada

      server.listen(port, async () => {

        useSetServer(localIP, port, uuid);

        //informar o DOM o ID da janela
        mainWindow.webContents
          .executeJavaScript(`setUUIDWindowApp(${uuid})`)
          .catch((e) => {
            console.log("try again");
          });
         
      });
      console.log(`Process listen in http://localhost:${port}`);
    }


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

    // 🚀 Buildar o APP (electron-builder)X
    // 🚀 Validar boas práticas da build (ex: configs de icones e etc)
    // 🚀 Gerar instalador (MSI)
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
