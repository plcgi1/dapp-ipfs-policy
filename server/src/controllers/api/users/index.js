const express = require('express')

const path = require('path')

const usersController = require(path.resolve('./src/controllers/api/users/user.controller'))

const router = express.Router()

router.get('/', usersController.getByAddress)

module.exports = router
