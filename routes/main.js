const express = require('express');
const router = express.Router();
const main = require('../controllers/main')

router.route('/')
    .get(main.index)
    .post(main.chooseCategory)


module.exports = router