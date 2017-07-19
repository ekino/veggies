'use strict'

const path = require('path')
const fs = require('fs')

exports.getFileContent = (cwd, file) =>
    new Promise((resolve, reject) => {
        fs.readFile(path.join(cwd, file), (err, data) => {
            if (err) return reject(err)
            resolve(data.toString('utf8'))
        })
    })
