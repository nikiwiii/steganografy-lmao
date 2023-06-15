const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('NotificationUtils', {
    showDialog: (type, title, message) => {
        ipcRenderer.invoke('SHOW_DIALOG', {
            title,
            type,
            message
        });
    },
    showNotification: (title, message) => {
        ipcRenderer.invoke('SHOW_NOTIFICATION', {
            title,
            body: message
        });
    }
});