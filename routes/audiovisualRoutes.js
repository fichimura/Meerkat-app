const express = require('express');
const router = express.Router({ mergeParams: true });
const audiovisualController = require('../controllers/audiovisualControllers');
const catchAsync = require('../utils/catchAsync');
const { isSignedIn, isAuthor, validateAudiovisual } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', catchAsync(audiovisualController.index));

router.get('/new', isSignedIn, audiovisualController.renderNewForm);

router.post('/', isSignedIn, upload.array('image'), validateAudiovisual, catchAsync(audiovisualController.createAudiovisual));

router.get('/:audiovisual_id', catchAsync(audiovisualController.showAudiovisual));

router.get('/:audiovisual_id/edit', isSignedIn, isAuthor, catchAsync(audiovisualController.showEditAudiovisual));

router.put('/:audiovisual_id', isSignedIn, isAuthor, upload.array('image'), validateAudiovisual, catchAsync(audiovisualController.editAudiovisual));

router.delete('/:audiovisual_id', isSignedIn, isAuthor, catchAsync(audiovisualController.deleteAudiovisual));


module.exports = router;