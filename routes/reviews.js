const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/reviews')
const catchAsync = require('../utils/catchAsync');
const { validateReviews, isLoggedIn, reviewAuthorize } = require('../middleware');

router.post('/', isLoggedIn, validateReviews, catchAsync(reviews.createReview));
router.delete('/:revID', isLoggedIn, reviewAuthorize, catchAsync(reviews.deleteReview));

module.exports = router
