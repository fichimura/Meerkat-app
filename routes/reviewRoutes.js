const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const catchAsync = require('../utils/catchAsync');
const { isSignedIn, validateReview, isReviewAuthor } = require('../middleware');

router.get('/userReviews', isSignedIn, catchAsync(reviewController.showUserReviews));

router.get('/audiovisuals/:audiovisual_id/reviews', catchAsync(reviewController.showAudiovisualReviews));

router.get('/audiovisuals/:audiovisual_id/reviews/new', isSignedIn, catchAsync(reviewController.renderNewForm));

router.get('/audiovisuals/:audiovisual_id/reviews/:review_id', catchAsync(reviewController.showAudiovisualSpecificReview));

router.post('/audiovisuals/:audiovisual_id/reviews', isSignedIn, validateReview, catchAsync(reviewController.createReview));

router.get('/audiovisuals/:audiovisual_id/reviews/:review_id/edit', isSignedIn, isReviewAuthor, catchAsync(reviewController.showEditReview));

router.put('/audiovisuals/:audiovisual_id/reviews/:review_id', isSignedIn, isReviewAuthor, validateReview, catchAsync(reviewController.editReview));

router.delete('/audiovisuals/:audiovisual_id/reviews/:review_id', isSignedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;