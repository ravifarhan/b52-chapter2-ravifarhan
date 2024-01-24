const multer = require('multer')

const file = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/assets/file')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: file })

module.exports = upload