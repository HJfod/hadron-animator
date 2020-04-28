const { BrowserWindow, app, Menu } = require("electron");
const ipc = require("electron").ipcMain;
const path = require("path");

let w;

app.on("ready", () => {
	w = new BrowserWindow({
		frame: false, minHeight: 400, webPreferences: { preload: path.join(__dirname, "scripts/backend/preload.js"), nodeIntegration: false, enableRemoteModule: false, contextIsolation: true } });

    w.loadFile("main.html");

    w.on("closed", () => {
        app.quit();
	});

	Menu.setApplicationMenu(Menu.buildFromTemplate(temp));
});

ipc.on("app", (event, arg) => {
	arg = JSON.parse(arg);
	switch (arg.action) {
		case "fs":
			let win = BrowserWindow.fromId(Number(arg.val));
			if (win.isMaximized()) {
				win.unmaximize();
			} else {
				win.maximize();
			}
			break;
		case "mz":
			BrowserWindow.fromId(Number(arg.val)).minimize();
			break;
		case "w-reload":
			w.reload();
			break;
		case "toggle-dev":
			w.toggleDevTools();
			break;
		case "return":
			w.webContents.send("app", `{ "action": "return", "text": "This is some text." }`);
			break;
		case "get-window-id":
			w.webContents.send("app", `{ "action": "window-id", "id": "${w.id}", "dir": "${path.join(__dirname).replace(/\\/g,"/")}" }`); 
			break;
	}
});

const temp = [
	{
		label: "File",
		submenu: [
			{
				label: "New File",
				accelerator: "Ctrl+N",
				click() {
					let o = {
						action: "new-file"
					}
					w.webContents.send("app", JSON.stringify(o));
				}
			},
			{
				label: "Save File",
				accelerator: "Ctrl+S",
				click() {
					let o = {
						action: "save-file"
					}
					w.webContents.send("app", JSON.stringify(o));
				}
			},
			{
				label: "Open File",
				accelerator: "Ctrl+O",
				click() {
					let o = {
						action: "open-file"
					}
					w.webContents.send("app", JSON.stringify(o));
				}
			},
			{ type: "separator" },
			{
				label: "Close",
				accelerator: "Alt+F4",
				click() {
					app.quit();
				}
			}
		]
	},
	{
		label: "Tools",
		submenu: [
			{
				label: "Add object",
				click() {
					let o = {
						action: "new-object"
					}
					w.webContents.send("app", JSON.stringify(o));
				}
			},
			{
				label: "Add image",
				click() {
					let o = {
						action: "new-image"
					}
					w.webContents.send("app", JSON.stringify(o));
				}
			},
			{ type: "separator" },
			{
				label: "Toggle grid",
				accelerator: "Ctrl+G",
				click() {
					let o = {
						action: "toggle-grid"
					}
					w.webContents.send("app", JSON.stringify(o));
				}
			}
		]
	},
	{
		label: "Help",
		submenu: [
			{
				label: "Reload",
				accelerator: "Ctrl+R",
				click() {
					w.reload();
				}
			},
			{
				label: "Open Console",
				accelerator: "Ctrl+Shift+I",
				click() {
					w.toggleDevTools();
				}
			}
		]
	}
];

/*
 * TODO:
 * 
 * -Remove jQuery
 * -Switch vars and functions to camelCase
 * -Move all node shit to backend
 * -Move shit to their own files
*/