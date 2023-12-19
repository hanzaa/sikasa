const express = require('express')
const router = express.Router()
const userController = require('../controller/user.controller')
const productController = require('../controller/product.controller')
const multer = require('multer')
const auth = require('../middleware/auth')


// Set up file storage using multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/',userController.welcomePage)

router.post('/register',userController.register)

router.post('/login',userController.login)

router.post('/verify',auth.verifyToken)

router.get('/data/alamatsurateksternal', productController.alamatsurateksternal) 

router.get('/data/alamatsuratinternal', productController.alamatsuratinternal) 

router.get('/data/derajat', productController.derajat) 

router.get('/data/sarkom', productController.sarkom) 

router.get('/data/sistem', productController.sistem) 

router.get('/data/petugas', productController.petugas) 

router.post('/upload',productController.handleFileSent, productController.uploadFile) // POST endpoint for uploading and encrypting a file

router.get('/download/:fileId', productController.downloadFile) // GET endpoint for downloading and decrypting a file

router.post('/upload/alamatsurateksternal', productController.insertalamatsurateksternal)
router.get('/data/allalamatsurateksternal', productController.allalamatsurateksternal) 

router.post('/upload/agendasrmasuk',upload.single('file'), productController.uploadFile, productController.insertagendasrmasuk) // POST endpoint for uploading and encrypting a file
router.get('/data/agendasrmasuk', productController.dataagendasrmasuk) 
router.put('/update/agendasrmasuk', productController.updateagendasrmasuk)
router.delete('/delete/agendasrmasuk', productController.deleteagendasrmasuk)

router.post('/upload/agendasrkeluar',upload.single('file'), productController.uploadFile, productController.insertagendasrkeluar) // POST endpoint for uploading and encrypting a file
router.get('/data/agendasrkeluar', productController.dataagendasrkeluar) 
router.put('/update/agendasrkeluar', productController.updateagendasrkeluar)
router.delete('/delete/agendasrkeluar', productController.deleteagendasrkeluar)

router.post('/upload/agendasbmasuk',upload.single('file'), productController.uploadFile, productController.insertagendasbmasuk) // POST endpoint for uploading and encrypting a file
router.get('/data/agendasbmasuk', productController.dataagendasbmasuk) 
router.put('/update/agendasbmasuk', productController.updateagendasbmasuk)
router.delete('/delete/agendasbmasuk', productController.deleteagendasbmasuk)

router.post('/upload/agendasbkeluar',upload.single('file'), productController.uploadFile, productController.insertagendasbkeluar) // POST endpoint for uploading and encrypting a file
router.get('/data/agendasbkeluar', productController.dataagendasbkeluar) 
router.put('/update/agendasbkeluar', productController.updateagendasbkeluar)
router.delete('/delete/agendasbkeluar', productController.deleteagendasbkeluar)


router.get('/api/data', productController.apidata) 





module.exports = router