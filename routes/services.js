const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const services = require('../controllers/services')
const { validateService, isLoggedIn, authorize } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(services.index)
    .post(isLoggedIn, upload.array('image'), validateService,  catchAsync(services.createService))

router.get('/new', isLoggedIn, services.newForm)

router.route('/show/:id')
    .get(catchAsync(services.individualProvider))
    .put(isLoggedIn, authorize, upload.array('image'), validateService, catchAsync(services.updateService))
    .delete(isLoggedIn, authorize, catchAsync(services.deleteService))

router.get('/:id', catchAsync(services.individualService))
router.get('/show/:id/edit', isLoggedIn, authorize, catchAsync(services.editForm));



module.exports = router