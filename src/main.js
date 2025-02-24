const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const scanner = require('./scanner');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Deshabilitado para mayor seguridad
            contextIsolation: true, // Habilitado para mayor seguridad
            preload: path.join(__dirname, 'ui/preload.js') // Archivo preload
        }
    });
    mainWindow.loadFile(path.join(__dirname, 'ui/index.html'));
});

ipcMain.handle('run-security-scan', async () => {
    return scanner.runScan();
});