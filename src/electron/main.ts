import '@electron/env'
import { JulesController } from "@electron/controllers/jules.controller";
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'


const isDev = process.env.NODE_ENV === 'development'

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  })

  if (isDev) {
    await win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    await win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  await createWindow()

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

//

ipcMain.handle('jules:source:get', JulesController.getSource);
ipcMain.handle('jules:source:list', JulesController.getSources);

ipcMain.handle('jules:session:get', JulesController.getSession);
ipcMain.handle('jules:session:list', JulesController.getSessions);
ipcMain.handle('jules:session:create', JulesController.createSession);
ipcMain.handle('jules:session:delete', JulesController.deleteSession);
ipcMain.handle('jules:session:message', JulesController.sendMessageSession);
ipcMain.handle('jules:session:approvePlan', JulesController.approvePlanSession);
