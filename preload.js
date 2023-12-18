const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    submitAuth: (id, password) => ipcRenderer.send('submit-auth', id, password)
});
