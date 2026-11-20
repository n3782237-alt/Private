const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
function createWindow() {
  const win = new BrowserWindow({
    width: 1500, height: 950, minWidth: 1050, minHeight: 700,
    backgroundColor: '#17191e',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile('index.html');
}
app.whenReady().then(() => { createWindow(); app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) createWindow(); }); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
ipcMain.handle('save-image', async (_e, dataUrl) => {
  const result = await dialog.showSaveDialog({ defaultPath: 'untitled.png', filters: [{ name: 'PNG Image', extensions: ['png'] }] });
  if (result.canceled || !result.filePath) return false;
  fs.writeFileSync(result.filePath, Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64'));
  return true;
});
