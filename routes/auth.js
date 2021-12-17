const express = require('express');

const controller = require('../controllers/auth');

const router = express.Router();

// localhost:8000/auth/login
router.post('/login', controller.login);
// localhost:8000/auth/registration
router.post('/registration', controller.register);
// localhost:8000/auth/get
router.post('/get', controller.get);
// localhost:8000/auth/getall
router.post('/getall', controller.getAll);

module.exports = router;
