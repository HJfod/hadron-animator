module.exports = {};

const { BrowserWindow, ipcMain } = require('electron');

ipcMain.on('ion-app', (event, arg) => {
    arg = JSON.parse(arg);
    switch (arg.name) {
        case 'fs':
            let win = BrowserWindow.fromId(Number(arg.val));
            if (win.isMaximized()) {
                win.unmaximize();
            } else {
                win.maximize();
            }
            break;
        case 'mz':
            BrowserWindow.fromId(Number(arg.val)).minimize();
            break;
    }
});