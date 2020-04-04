const express = require('express')
const router = express.Router()
const userController = require('../controller/userContoller')


router.post('/', userController.refreshToken)


module.exports = router