const { app, BrowserWindow, utilityProcess } = require('electron')
const path = require('node:path')
const http = require('node:http')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  const server = http.createServer((req, res) => {
    console.log("Request received")
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello, World!\n')
  })

  server.listen(3000, '127.0.0.1', () => {
    console.log('Server up')

    utilityProcess.fork(path.join(__dirname, 'utility.js'))
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
