const Joi = require('joi');

module.exports.audiovisualSchema = Joi.object({
    audiovisual: Joi.object({
        type: Joi.string().required(),
        title: Joi.string().required(),
        director: Joi.string().allow(''),
        main_cast: Joi.string().allow(''),
        country: Joi.string().allow(''),
        rating: Joi.string().allow(''),
        release_year: Joi.number().allow(''),
        duration: Joi.string().allow(''),
        listed_in: Joi.string().allow(''),
        description: Joi.string().allow('')
    }).required(),
    deleteImages: Joi.array()
});

const todayDate = new Date();
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        title: Joi.string().allow(''),
        rating: Joi.number().min(0).max(5).required(),
        where: Joi.string().allow(''),
        when: Joi.number().min(1920).max(todayDate.getFullYear()).allow(''),
        favorite: Joi.boolean().allow(''),
        notes: Joi.string().required()
    }).required()
});