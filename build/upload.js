const qiniu = require('qiniu')
const fs = require('fs')
const path = require('path')

const cdnConfig = require('../app.config').cdn
const excludeFiles = ['index.html', 'server.ejs', 'server-entry.js']

const { ak, sk, bucket } = cdnConfig

const mac = new qiniu.auth.digest.Mac(ak, sk)

const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z0

const doUpload = (key, file) => {
	const options = {
		scope: bucket + ':' + key
	}
	const formUploader = new qiniu.form_up.FormUploader(config)
	const putExtra = new qiniu.form_up.PutExtra()
	const putPolicy = new qiniu.rs.PutPolicy(options)
	const uploaderToken = putPolicy.uploadToken(mac)
	return new Promise((resolve, reject) => {
		formUploader.putFile(uploaderToken, key, file, putExtra, (err, body, info) => {
			if (err) {
				return reject(err)
			}
			if (info.statusCode === 200) {
				resolve(body)
			} else {
				reject(info)
			}
		})
	})
}

const files = fs.readdirSync(path.join(__dirname, '../dist'))
const uploads = files.map(file => {
	if (excludeFiles.indexOf(file) === -1) {
		return doUpload(file, path.join(__dirname, '../dist', file))
	} else {
		return Promise.resolve(`${file} no need to upload`)
	}
})

Promise.all(uploads).then(res => {
	console.log('upload success:', res)
}).catch(err => {
	console.log('upload fail:', err)
	process.exit(0)
})
