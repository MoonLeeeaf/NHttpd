/**
 * NHttpd: 一个超级轻量的 HTTP 服务器
 * GitHub @满月叶
 * ©2024
 */

const express = require('express')
const fs = require('fs')
const fsp = fs.promises
const mime = require('mime')

const app = express()
const http = require('http')
const https = require('https')

const color = require('./color')

const isBinaryFile = require("isbinaryfile").isBinaryFileSync

let httpServer

function log(t) {
    console.log("[" + new Date().toLocaleTimeString('en-US', { hour12: false }) + "] " + t)
}

function replaceExec(txt, req, res) {
    return txt.replace(/<script nhttpd>([\s\S]*?)<\/script>/g, (_match, group) => {
        try {
            return (new Function("req", "res", "require", "log", "console", group))(req, res, require, log, console)
        } catch (e) {
            log(`${color.red}Script error: ${e + color.none}`)
            return e
        }
    })
}

/**
 * 封装文件发送函数
 * @param { express.Request } req 
 * @param { express.Response } res 
 * @param { String } filePath 
 */
async function sendFile(req, res, filePath) {

    let content = fs.readFileSync(filePath)
    let rangeHead = req.get("Range")
    let fileLength = fs.lstatSync(filePath).size
    let file

    if (!isBinaryFile(content, fileLength)) {
        content = replaceExec(content.toString(), req, res)
        log(`File type -> binary file`)
    }else if (rangeHead != null) {
        // https://github.com/MoonLeeeaf/Android-Httpd/commit/35dafa37ce8bce8cf5940c1520c856f4e75f0633
        let rangeStart = 0
        let rangeEnd = fileLength - 1
        let ranges = rangeHead.split("=")[1].split("-")

        rangeStart = parseInt(ranges[0])
        if (ranges.length > 1 && ranges[1] != '') {
            rangeEnd = parseInt(ranges[1])
        }

        let contentLength = rangeEnd - rangeStart + 1

        let contentBuffer = Buffer.alloc(contentLength)

        file = await fsp.open(filePath, "r")
        await file.read(contentBuffer, rangeStart, contentLength)
        res.setHeader('Content-Length', contentLength)
        res.setHeader('Content-Range', `bytes ${rangeStart}-${rangeEnd}/${fileLength}`)
        res.setHeader('Accept-Ranges', 'bytes')

        log(`Send with Content-Range`)
    }

    res.setHeader('Content-Type', mime.lookup(filePath))

    res.status(200).send(content)

    if (file)
        await file.close()
    
    log(`Send file successfully: ${filePath}`)
}

app.get('/', async (req, res) => {
    let filePath = 'page/index.html'
    try {
        await sendFile(req, res, filePath)
    } catch (e) {
        res.status(500).send(`NHttpd Error: ${e}`)
        log(`${color.yellow}Error: ${e}, file=${filePath + color.none}`)
    }
})

app.get('/*', async (req, res) => {
    let filePath = 'page' + decodeURI(req.path || '/index.html')
    try {
        await sendFile(req, res, filePath)
    } catch (e) {
        res.status(500).send(`NHttpd Error: ${e}`)
        log(`${color.yellow}Error: ${e}, file=${filePath + color.none}`)
    }
})

// 目前还没考虑到这玩意怎么配置
if (false)
    httpServer = https.createServer({
        key: fs.readFileSync('nhttpd_key'),
        cert: fs.readFileSync('nhttpd_cert'),
    }, app)
else
    httpServer = http.createServer(app)

// 默认80, 需要的话可以改或者提供第二个arg

let port = parseInt(process.argv[2])
port = isNaN(port) ? 80 : port
httpServer.listen(port)

console.log(`${color.green}Server started with port ${port + color.none}`)
