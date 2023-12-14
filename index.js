const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let authCredentials = { id: "", password: "" };
let mainWindow;

function createAuthWindow() {
  const authWindow = new BrowserWindow({
    icon: path.join(__dirname, "app.icns"),
    width: 400,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // ここに preload スクリプトを指定
      nodeIntegration: false,
    },
  });

  // 認証情報入力画面のロード（HTMLファイルのパスを指定）
  authWindow.loadFile("auth.html");

  ipcMain.once("submit-auth", (event, id, password) => {
    authCredentials = { id, password };
    console.log(authCredentials);
    authWindow.close();
    createMainWindow();
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "app.icns"),
    width: 512,
    height: 330,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL("http://solar-monitor.local/");

  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.setZoomFactor(0.5);
    mainWindow.webContents.insertCSS(
      "body::-webkit-scrollbar { display: none; }"
    );
  });

  mainWindow.webContents.on("login", (event, request, authInfo, callback) => {
    event.preventDefault();
    callback(authCredentials.id, authCredentials.password); // メモリ上の認証情報を使用
  });
}

app.whenReady().then(createAuthWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
