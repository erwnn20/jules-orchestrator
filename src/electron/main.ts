import '@electron/env'
import { GithubController } from "@electron/controllers/github.controller";
import { JulesController } from "@electron/controllers/jules.controller";
import { app, BrowserWindow, ipcMain, shell } from 'electron'
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

new JulesController().registerHandlers()
new GithubController().registerHandlers()

ipcMain.handle('utils:open-link', async (event, url: string) => shell.openExternal(url))
