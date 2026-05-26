import { normalizeError } from "@electron/utils/error.util";
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
    for (const { channel, listener } of this.handlers)
      ipcMain.handle(channel, async (event, ...args) => {
        try {
          return { ok: true, data: await listener(event, ...args) }
        } catch (err) {
          return { ok: false, error: normalizeError(err) }
        }
      })
  }
}