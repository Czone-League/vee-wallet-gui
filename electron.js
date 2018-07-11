const {app, BrowserWindow} = require('electron')

// let url
// if (process.env.NODE_ENV === 'DEV') {
//     url = 'http://localhost:8080/'
// } else {
//     url = `file://${__dirname}/dist/index.html`
// }

let window;
function createWindow() {
    window = new BrowserWindow({
        title: 'VEE Client',
        height: 600,
        width: 1000,
        minHeight: 600,
        minWidth: 800,
        minimizable: true,
        webPreferences: {
            webSecurity: false
        }
    })
    // app.on('ready', () => {
    window.loadFile('index.html');
    // })
    // setTimeout(() => {
    //     window.loadURL(url);
    // }, 2000);
    window.openDevTools()
    window.on('close', () => {
        window = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (window === null) {
        createWindow()
    }
})
