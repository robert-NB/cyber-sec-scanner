const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    runSecurityScan: () => ipcRenderer.invoke('run-security-scan')
});