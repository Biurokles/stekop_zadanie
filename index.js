const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const path = require('node:path')
const fs = require('fs');

async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Wybierz plik tekstowy',
    filters: [{ name: 'Pliki tekstowe', extensions: ['txt'] }],
  })
  if (!canceled) {
  const filePath = filePaths[0];
  const content = fs.readFileSync(filePath, 'utf8');

  return {content, filePath, canceled:false };
  }
  else
  {
    return {canceled:true};
  }
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadFile('main/index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})