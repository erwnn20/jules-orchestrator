import { HttpClient } from "@electron/utils/http-client";
import { ipcMain } from "electron";

export abstract class BaseController {
  protected constructor(
    protected readonly httpClient: HttpClient,
    protected readonly handlers: {
      channel: string,
      listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
    }[]
  ) { }

  registerHandlers() {
    for (const { channel, listener } of this.handlers) ipcMain.handle(channel, listener)
  }
}