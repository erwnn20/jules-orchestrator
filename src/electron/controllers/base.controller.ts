import { ipcMain } from "electron";

export abstract class BaseController<Client> {
  protected constructor(
    protected readonly client: Client,
    protected readonly handlers: {
      channel: string,
      listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
    }[]
  ) { }

  registerHandlers() {
    for (const { channel, listener } of this.handlers) ipcMain.handle(channel, listener)
  }
}